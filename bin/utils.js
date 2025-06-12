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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENT_DIR = exports.CLIENT_ROOT = void 0;
exports.copyFile = copyFile;
exports.deleteFile = deleteFile;
exports.deleteDir = deleteDir;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
exports.CLIENT_ROOT = 'contract_client';
exports.CURRENT_DIR = process.cwd();
function copyFile(filePath, dest) {
    fs.copyFileSync(path_1.default.join(exports.CURRENT_DIR, filePath), path_1.default.join(exports.CURRENT_DIR, dest));
}
function deleteFile(filePath, absolutePath = false) {
    if (!absolutePath) {
        fs.rmSync(path_1.default.join(exports.CURRENT_DIR, filePath));
    }
    else {
        fs.rmSync(filePath);
    }
}
function deleteDir(dirPath, recursive = false) {
    if (!fs.existsSync(dirPath)) {
        throw new Error('path does not exists: ' + dirPath);
    }
    fs.readdirSync(dirPath).forEach(fileName => {
        const filePath = !recursive
            ? path_1.default.join(exports.CURRENT_DIR, dirPath, fileName)
            : path_1.default.join(dirPath, fileName);
        if (fs.lstatSync(filePath).isDirectory()) {
            deleteDir(filePath, true);
        }
        else {
            deleteFile(filePath, true);
        }
    });
    fs.rmdirSync(path_1.default.join(exports.CURRENT_DIR, dirPath));
}
