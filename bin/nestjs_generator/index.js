"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNestProject = generateNestProject;
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const module_generator_1 = require("./module_generator");
const main_module_generator_1 = require("./main_module_generator");
const env_file_gnerator_1 = require("./env_file_gnerator");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const degit_1 = __importDefault(require("degit"));
async function generateNestProject(data) {
    const { idlProgram, nestjsPath, contractClientPath, outPath, rpcUrl, nodeEnv, port, contractId, contractIdl } = data;
    console.log('⚙️ Working in server ...');
    // clone the base repository for the nestjs server
    const nestJsSrcDir = path_1.default.join(nestjsPath, 'src');
    const emitter = (0, degit_1.default)(utils_2.GITHUB_BASE_NESTJS, { cache: false, force: true });
    await emitter.clone(outPath);
    fs_extra_1.default.moveSync(contractClientPath, path_1.default.join(nestJsSrcDir, utils_1.CONTRACT_CLIENT_OUT_DIR));
    const servicesNames = idlProgram.serviceNames().filter(serviceName => serviceName != 'KeyringService');
    const readmePath = path_1.default.join(nestjsPath, 'README.md');
    const readmeContent = fs_extra_1.default.readFileSync(readmePath, 'utf8');
    const temp = readmeContent.indexOf('<p align="center">');
    let readmeFileContent = readmeContent.substring(0, temp);
    const lines = [
        readmeFileContent,
    ];
    lines.push('### Nestjs url');
    lines.push('Following are the available url for nestjs server based on the provided idl:');
    for (const serviceName of servicesNames) {
        const moduleUrls = (0, module_generator_1.moduleGenerator)(serviceName, nestJsSrcDir, idlProgram, port);
        moduleUrls.forEach(url => {
            const { serviceName, funcName, url: urlStr, isQuery } = url;
            const functionType = url.isQuery ? 'command' : 'query';
            lines.push(`- Url for ${funcName} ${functionType} in service ${serviceName}: *${urlStr}*`);
        });
    }
    lines.push('');
    lines.push(`<p align="center">`);
    lines.push(`    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />`);
    lines.push(`</p>`);
    const readmeCode = lines.join('\n');
    console.log('Nestjs Modules created ✅');
    (0, main_module_generator_1.createMainModule)(nestJsSrcDir, servicesNames);
    console.log('NestJs Main module created ✅');
    (0, env_file_gnerator_1.createEnvFile)({
        nestJsPath: nestjsPath,
        rpcUrl,
        nodeEnv,
        port,
        contractId,
        contractIdl
    });
    fs_extra_1.default.writeFileSync(readmePath, readmeCode);
    console.log('Env file created ✅');
}
