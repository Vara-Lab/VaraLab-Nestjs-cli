"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GITHUB_BASE_NESTJS = exports.CURRENT_DIR = exports.CONTRACT_CLIENT_OUT_DIR = void 0;
exports.checkAndGetIdlProgram = checkAndGetIdlProgram;
exports.pathExists = pathExists;
exports.copyFile = copyFile;
exports.deleteFile = deleteFile;
exports.createFile = createFile;
exports.deleteDir = deleteDir;
const IdlProgram_1 = require("./IdlProgram");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.CONTRACT_CLIENT_OUT_DIR = 'contract_client';
exports.CURRENT_DIR = process.cwd();
exports.GITHUB_BASE_NESTJS = 'https://github.com/Vara-Lab/NestJs-Base-Template.git';
async function checkAndGetIdlProgram(idlPath) {
    const idlContent = fs_extra_1.default.readFileSync(idlPath, 'utf8');
    const idlProgram = await IdlProgram_1.IdlProgram.new(idlContent);
    const service = idlProgram.getService('KeyringService');
    if (!service) {
        throw new Error('KeyringService not found');
    }
    const keyringMethods = idlProgram.serviceFuncNames('KeyringService');
    for (const func of keyringMethods) {
        const funcExists = keyringMethods.find(funcName => funcName == func);
        if (!funcExists)
            throw new Error(`Function ${func} not found`);
    }
    return idlProgram;
}
function pathExists(sourcePath) {
    return fs_extra_1.default.existsSync(sourcePath);
}
function copyFile(filePath, dest) {
    fs_extra_1.default.copyFileSync(path_1.default.join(exports.CURRENT_DIR, filePath), path_1.default.join(exports.CURRENT_DIR, dest));
}
function deleteFile(filePath, absolutePath = false) {
    if (!absolutePath) {
        fs_extra_1.default.rmSync(path_1.default.join(exports.CURRENT_DIR, filePath));
    }
    else {
        fs_extra_1.default.rmSync(filePath);
    }
}
function createFile(filePath, content) {
    fs_extra_1.default.createFileSync(filePath);
    fs_extra_1.default.writeFileSync(filePath, content);
}
function deleteDir(dirPath, recursive = false) {
    if (!fs_extra_1.default.existsSync(dirPath)) {
        throw new Error('path does not exists: ' + dirPath);
    }
    fs_extra_1.default.readdirSync(dirPath).forEach(fileName => {
        const filePath = !recursive
            ? path_1.default.join(exports.CURRENT_DIR, dirPath, fileName)
            : path_1.default.join(dirPath, fileName);
        if (fs_extra_1.default.lstatSync(filePath).isDirectory()) {
            deleteDir(filePath, true);
        }
        else {
            deleteFile(filePath, true);
        }
    });
    fs_extra_1.default.rmdirSync(path_1.default.join(exports.CURRENT_DIR, dirPath));
}
