
import { Command } from 'commander';
import { 
  deleteDir,
  checkAndGetIdlProgram,
  CURRENT_DIR,
  CONTRACT_CLIENT_OUT_DIR
} from './utils'; 
import { createClient } from './client_generator';
import { generateNestProject } from './nestjs_generator';
import { userEntrySchema } from './validator/userEntry';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { treeifyError } from 'zod';

const program = new Command();

interface UserInputData {
  [key: string]: string
}

program
  .name('idl-to-nestjs')
  .description('CLI to generate a NestJS server from an IDL file')
  .version('0.1.0');

program
  .argument('<idl-file>', 'Path to the .idl file')
  .option('-o, --output <dir>', 'Directorio de salida', 'generated-server')
  .action(async (idlFile, options) => {
    const {output}: { output: string } = options;

    try {
      // Check if output dir exists
      if (fs.existsSync(output)) {
        throw new Error(`Directory '${output}' already exists`);
      }

      // create the idl program
      const idlProgram = await checkAndGetIdlProgram(idlFile);
      const nestJsDir = path.join(CURRENT_DIR, output);
      const contractClientPath = path.join(CURRENT_DIR, CONTRACT_CLIENT_OUT_DIR);

      const answers: UserInputData = await inquirer.prompt([
        { type: 'list', name: 'rpcUrl', message: 'RPC Url: ', choices: ['wss://testnet.vara.network', 'wss://rpc.vara.network', 'ws://localhost:9944'] },
        { type: 'list',  name: 'nodeEnv', message: 'Nest env: ', choices: ['development', 'production'] },
        { type: 'input', name: 'portNumber', message: 'Port Number: ', default: '8000' },
        { type: 'input', name: 'contractId', message: 'Contract address: ', default: '0x' },
        { type: 'input', name: 'workerWaitingTime', message: 'Worker waiting time (miliseconds): ', default: '7000' },
        { type: 'input', name: 'sponsorName', message: 'Sponsor name: ', default: '' },
        { type: 'input', name: 'sponsorMnemonic', message: 'Sponsor mnemonic: ', default: ''},
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

      const result = userEntrySchema.safeParse(nestJsData);

      if (!result.success) {
        console.log('❌ Error! Bad entries: ');
        const errors = treeifyError(result.error).properties ?? {};

        Object.entries(errors).forEach(([k, v]) => {
          if (k == 'contractIdl') {
            console.log(`> ${k} - Invalid input: Invalid address!`);
          } else {
            console.log(`> ${k} - ${v.errors}`);
          }
        })

        process.exit(-1);
      }

      // create the output dir
      fs.mkdirSync(output);
      
      // [TODO]: Commented until error is fixed with typescript
      // Create idl types and client for program
      // createClient(idlFile);
      // console.log('✅ IDL types and program created');

      // Create all the nestjs server
      await generateNestProject(result.data);
      
      console.log(`\n🎉 NestJS server created in: ${output}`);

      process.exit();
    } catch (e) {
      const err = e as Error;

      if (fs.existsSync(CONTRACT_CLIENT_OUT_DIR)) {
        deleteDir(CONTRACT_CLIENT_OUT_DIR);
      }

      console.error(`❌ Error: ${err.message}`);
    }
  });

program.parse(process.argv);  