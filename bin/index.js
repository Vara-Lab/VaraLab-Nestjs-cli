#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const program = new commander_1.Command();
function createProgram(idlPath) {
    console.log('📦 Generating TypeScript client libraries from Sails IDL file ...');
    (0, child_process_1.execSync)(`npx sails-js-cli generate ${idlPath} -o contract_client`);
}
program
    .name('idl-to-nestjs')
    .description('CLI to generate a NestJS server from an IDL file')
    .version('0.1.0');
program
    .argument('<idl-file>', 'Path to the .idl file')
    .option('-o, --output <dir>', 'Directorio de salida', 'generated-server')
    .action(async (idlFile, options) => {
    try {
        createProgram(idlFile);
        const idlContent = fs.readFileSync(idlFile, 'utf8');
        // const parsedIDL = parseIDL(idlContent);
        // await generateNestProject(parsedIDL, options.output);
        console.log(`✅ Servidor NestJS generado en: ${options.output}`);
    }
    catch (e) {
        const err = e;
        console.error(`❌ Error: ${err.message}`);
    }
});
program.parse(process.argv);
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
