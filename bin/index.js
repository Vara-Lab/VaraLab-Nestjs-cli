"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const utils_1 = require("./utils");
const nestjs_generator_1 = require("./nestjs_generator");
const userEntry_1 = require("./validator/userEntry");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const zod_1 = require("zod");
const program = new commander_1.Command();
program
    .name('idl-to-nestjs')
    .description('CLI to generate a NestJS server from an IDL file')
    .version('1.1.5');
program
    .argument('<idl-file>', 'Path to the .idl file')
    .option('-o, --output <dir>', 'Directorio de salida', 'generated-server')
    .action(async (idlFile, options) => {
    const { output } = options;
    try {
        // Check if output dir exists
        if (fs_extra_1.default.existsSync(output)) {
            throw new Error(`Directory '${output}' already exists`);
        }
        // create the idl program
        const idlProgram = await (0, utils_1.checkAndGetIdlProgram)(idlFile);
        const nestJsDir = path_1.default.join(utils_1.CURRENT_DIR, output);
        const contractClientPath = path_1.default.join(utils_1.CURRENT_DIR, utils_1.CONTRACT_CLIENT_OUT_DIR);
        const answers = await inquirer_1.default.prompt([
            { type: 'list', name: 'rpcUrl', message: 'RPC Url: ', choices: ['wss://testnet.vara.network', 'wss://rpc.vara.network', 'ws://localhost:9944'] },
            { type: 'input', name: 'contractId', message: 'Contract address: ', default: '0x' },
            { type: 'input', name: 'sponsorName', message: 'Sponsor name: ', default: '' },
            { type: 'input', name: 'sponsorMnemonic', message: 'Sponsor mnemonic: ', default: '' },
            { type: 'list', name: 'nodeEnv', message: 'Nest env: ', choices: ['development', 'production'] },
            { type: 'input', name: 'portNumber', message: 'Port Number: ', default: '8000' },
            { type: 'input', name: 'workerWaitingTime', message: 'Worker waiting time (miliseconds): ', default: '7000' },
            { type: 'input', name: 'initialTokensForVoucher', message: 'Initial tokens for voucher: ', default: '4' },
            { type: 'input', name: 'initialVoucherExpiration', message: 'Initial voucher expiration (in blocks): ', default: '1200' },
            { type: 'input', name: 'minTokensForVoucher', message: 'Min tokens in voucher: ', default: '3' },
            { type: 'input', name: 'tokensToAddToVOucher', message: 'Tokens to add to vouchers: ', default: '3' },
            { type: 'input', name: 'newVoucherExpiration', message: 'Blocks to extend expired voucher: ', default: '1200' },
        ]);
        console.log('');
        const nestJsData = {
            idlProgram,
            nestjsPath: nestJsDir,
            contractClientPath,
            outPath: output,
            contractIdl: idlProgram.getIdlContent,
            contractId: answers.contractId.trim(),
            rpcUrl: answers.rpcUrl,
            nodeEnv: answers.nodeEnv,
            port: answers.portNumber,
            sponsorName: answers.sponsorName,
            sponsorMnemonic: answers.sponsorMnemonic,
            workerWaitingTime: answers.workerWaitingTime,
            initialTokensForVoucher: answers.initialTokensForVoucher,
            initialVoucherExpiration: answers.initialVoucherExpiration,
            minTokensForVoucher: answers.minTokensForVoucher,
            tokensToAddToVOucher: answers.tokensToAddToVOucher,
            newVoucherExpiration: answers.newVoucherExpiration
        };
        const result = userEntry_1.userEntrySchema.safeParse(nestJsData);
        if (!result.success) {
            console.log('❌ Error! Bad entries: ');
            const errors = (0, zod_1.treeifyError)(result.error).properties ?? {};
            Object.entries(errors).forEach(([k, v]) => {
                if (k == 'contractIdl') {
                    console.log(`> ${k} - Invalid input: Invalid address!`);
                }
                else {
                    console.log(`> ${k} - ${v.errors}`);
                }
            });
            process.exit(-1);
        }
        // create the output dir
        fs_extra_1.default.mkdirSync(output);
        // [TODO]: Commented until error is fixed with typescript
        // Create idl types and client for program
        // createClient(idlFile);
        // console.log('✅ IDL types and program created');
        // Create all the nestjs server
        await (0, nestjs_generator_1.generateNestProject)(result.data);
        console.log(`\n🎉 NestJS server created in: ${output}`);
        console.log(`❗ Dont forget to set your JWT tokens to .env!`);
        process.exit();
    }
    catch (e) {
        const err = e;
        if (fs_extra_1.default.existsSync(utils_1.CONTRACT_CLIENT_OUT_DIR)) {
            (0, utils_1.deleteDir)(utils_1.CONTRACT_CLIENT_OUT_DIR);
        }
        console.error(`❌ Error: ${err.message}`);
    }
});
program.parse(process.argv);
