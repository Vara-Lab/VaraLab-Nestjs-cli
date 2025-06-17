"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const utils_1 = require("./utils");
const client_generator_1 = require("./client_generator");
const nestjs_generator_1 = require("./nestjs_generator");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const program = new commander_1.Command();
program
    .name('idl-to-nestjs')
    .description('CLI to generate a NestJS server from an IDL file')
    .version('0.1.0');
program
    .argument('<idl-file>', 'Path to the .idl file')
    // .argument('<template>', 'Repositorio de GitHub o ruta local (formato user/repo o ./ruta)')
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
            { type: 'input', name: 'rpcUrl', message: 'RPC Url: ', default: 'wss://testnet.vara.network' },
            { type: 'input', name: 'portNumber', message: 'Port Number: ', default: '8000' },
            { type: 'list', name: 'nodeEnv', message: 'Nest env: ', choices: ['development', 'production'] },
            { type: 'input', name: 'contractId', message: 'Contract address: ', default: '0x' },
        ]);
        console.log('');
        // create the output dir
        fs_extra_1.default.mkdirSync(output);
        // Create idl types and client for program
        (0, client_generator_1.createClient)(idlFile);
        console.log('✅ IDL types and program created');
        const nestJsData = {
            idlProgram,
            nestjsPath: nestJsDir,
            contractClientPath,
            outPath: output,
            rpcUrl: answers.rpcUrl,
            nodeEnv: answers.nodeEnv,
            port: answers.portNumber,
            contractId: answers.contractId,
            contractIdl: idlProgram.getIdlContent
        };
        // Create all the nestjs server
        await (0, nestjs_generator_1.generateNestProject)(nestJsData);
        console.log(`\n🎉 NestJS server created in: ${output}`);
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
