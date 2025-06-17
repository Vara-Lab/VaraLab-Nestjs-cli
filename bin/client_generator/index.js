"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
const utils_1 = require("../utils");
const child_process_1 = require("child_process");
const utils_2 = require("../utils");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function createClient(idlPath) {
    console.log('📦 Generating TypeScript client libraries and types from Sails IDL file ...');
    const toDelete = [
        'package.json',
        'tsconfig.json'
    ];
    (0, child_process_1.execSync)(`npx sails-js-cli generate ${idlPath} -o ${utils_2.CONTRACT_CLIENT_OUT_DIR}`);
    (0, utils_1.copyFile)(`${utils_2.CONTRACT_CLIENT_OUT_DIR}/src/global.d.ts`, `${utils_2.CONTRACT_CLIENT_OUT_DIR}/global.d.ts`);
    (0, utils_1.copyFile)(`${utils_2.CONTRACT_CLIENT_OUT_DIR}/src/lib.ts`, `${utils_2.CONTRACT_CLIENT_OUT_DIR}/lib.ts`);
    (0, utils_1.deleteDir)(`${utils_2.CONTRACT_CLIENT_OUT_DIR}/src`);
    toDelete.forEach(file => (0, utils_1.deleteFile)(`${utils_2.CONTRACT_CLIENT_OUT_DIR}/${file}`));
    const clientCodePath = path_1.default.join(utils_2.CONTRACT_CLIENT_OUT_DIR, 'lib.ts');
    let clientCode = fs_extra_1.default.readFileSync(`${utils_2.CONTRACT_CLIENT_OUT_DIR}/lib.ts`, 'utf8');
    clientCode = `import { ZERO_ADDRESS } from 'sails-js';\n` + clientCode;
    fs_extra_1.default.writeFile(clientCodePath, clientCode);
}
