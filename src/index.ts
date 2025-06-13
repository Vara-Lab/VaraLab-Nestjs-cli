#!/usr/bin/env node

import { Command } from 'commander';
// import { generateNestProject } from './generator';
import { execSync } from 'child_process';
import { 
  deleteDir,
  pathExists,
  CLIENT_ROOT, 
  CURRENT_DIR
} from './utils'; 
import { createClient } from './client_generator';
import { IdlProgram } from './IdlProgram';
import { generateNestProject } from './nestjs_generator';
import * as fs from 'fs';

const program = new Command();

program
  .name('idl-to-nestjs')
  .description('CLI to generate a NestJS server from an IDL file')
  .version('0.1.0');

program
  .argument('<idl-file>', 'Path to the .idl file')
  .option('-o, --output <dir>', 'Directorio de salida', 'generated-server')
  .action(async (idlFile, options) => {
    console.log('Path: ', CURRENT_DIR);

    try {
      console.log('⚙️ Generating types ...')
      // createClient(idlFile);

      const idlContent = fs.readFileSync(idlFile, 'utf8');
      const idlProgram = await IdlProgram.new(idlContent);

      await generateNestProject(idlProgram, options.output, CURRENT_DIR);

      // await generateNestProject(
      //   idlProgram,
      //   ''
      // );
      // await generateNestProject(parsedIDL, options.output);

      console.log(`✅ Servidor NestJS generado en: ${options.output}`);
    } catch (e) {
      const err = e as Error;

      if (fs.existsSync(CLIENT_ROOT)) {
        deleteDir(CLIENT_ROOT);
      }

      console.error(`❌ Error: ${err.message}`);
    }
  });

program.parse(process.argv);  




/*
{
  "name": "SailsProgram",
  "type": "module",
  "dependencies": {
    "@gear-js/api": "^0.42.0",
    "@polkadot/api": "^15.9.1",
    "sails-js": "0.4.2"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  },
  "scripts": {
    "build": "tsc"
  }
}





{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "outDir": "lib"
  },
  "include": [
    "src"
  ]
}
*/







// import { SailsIdlParser, TypeDef } from "sails-js-parser";
// import { EnumDef } from "sails-js-parser";
// import { execSync } from "child_process";
// import * as fs from 'fs';

// interface IService {
//   name: string;
//   functions: number
// }

// interface IServiceFunction {
//   name: string;
// }

// console.log('\n\n\nProgram execution: \n\n\n');


// const main = async () => {

// }

// // const main = async () => {
// //   const parser = await SailsIdlParser.new()
// //   let idlContent = '';

// //   try {
// //       idlContent = fs.readFileSync('./contract.idl', 'utf8');
// //       // console.log('Contract idl:');
// //       // console.log(idlContent);
// //   } catch (e) {
// //       console.log('ERROOOOOOR');
// //       console.log(e);
// //   }

// //   const x = parser.parse(idlContent);

// //   console.log('Program from idl:');
// //   // console.log(x);

// //   const servicesNames = x.services.map(service => {
// //       // console.log(service);
// //       // console.log(func);
// //       console.log('\nService name: ', service.name);
// //       service.funcs.forEach(serv => {
// //         console.log('Func name:', serv.name, ', is query: ', serv.isQuery ? 'YES':'NO');
        
// //         serv.params.forEach(param =>{
// //           console.log('Param name: ', param.name, ' ----------------');
// //           console.log('Param definition: ', param.def);
// //           console.log(param.def);
// //         });

// //         console.log('\n');
// //       })

// //       return service.name;
// //   });

// //   console.log('\n\nTypes:');

// //   x.types.forEach(idlType => {
// //     console.log('------- name: ', idlType.name);
// //     console.log('User defined: ', idlType.def.isUserDefined ? 'YES':'NO');
// //     if (idlType.def.isEnum) {
// //       console.log('Is enum, nesting: ', idlType.def.asEnum.isNesting?'YES':'NO');
// //       idlType.def.asEnum.variants.forEach(variant => {
// //         console.log('variant name: ', variant.name, ' -------');
// //         console.log(variant.def);
// //       });
// //     }
// //   });
// // }

// main();





















