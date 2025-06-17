
import { Command } from 'commander';
import { 
  deleteDir,
  checkAndGetIdlProgram,
  CURRENT_DIR,
  CONTRACT_CLIENT_OUT_DIR
} from './utils'; 
import { createClient } from './client_generator';
import { generateNestProject } from './nestjs_generator';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

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
  // .argument('<template>', 'Repositorio de GitHub o ruta local (formato user/repo o ./ruta)')
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
        { type: 'input', name: 'rpcUrl', message: 'RPC Url: ', default: 'wss://testnet.vara.network' },
        { type: 'input', name: 'portNumber', message: 'Port Number: ', default: '8000' },
        { type: 'list', name: 'nodeEnv', message: 'Nest env: ', choices: ['development', 'production'] },
        { type: 'input', name: 'contractId', message: 'Contract address: ', default: '0x' },
      ]);

      console.log('');

      // create the output dir
      fs.mkdirSync(output);
      
      // Create idl types and client for program
      createClient(idlFile);
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
      await generateNestProject(nestJsData);
      
      console.log(`\n🎉 NestJS server created in: ${output}`);
    } catch (e) {
      const err = e as Error;

      if (fs.existsSync(CONTRACT_CLIENT_OUT_DIR)) {
        deleteDir(CONTRACT_CLIENT_OUT_DIR);
      }

      console.error(`❌ Error: ${err.message}`);
    }
  });

program.parse(process.argv);  