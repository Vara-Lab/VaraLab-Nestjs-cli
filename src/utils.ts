import { IdlProgram } from './IdlProgram';
import path from "path";
import fs from 'fs-extra';

export const CONTRACT_CLIENT_OUT_DIR = 'contract_client';
export const CURRENT_DIR = process.cwd();
export const GITHUB_BASE_NESTJS = 'https://github.com/Vara-Lab/NestJs-Base-Template.git';

export async function checkAndGetIdlProgram(idlPath: string): Promise<IdlProgram> {
  const idlContent = fs.readFileSync(idlPath, 'utf8');
  const idlProgram = await IdlProgram.new(idlContent);

  const service = idlProgram.getService('KeyringService');

  if (!service) {
    throw new Error('KeyringService not found');
  }

  const keyringMethods = idlProgram.serviceFuncNames('KeyringService');

  for (const func of keyringMethods) {
    const funcExists = keyringMethods.find(funcName => funcName == func);

    if (!funcExists) throw new Error(`Function ${func} not found`);
  }

  return idlProgram;
}

export function pathExists(sourcePath: string) {
  return fs.existsSync(sourcePath);
}

export function copyFile(filePath: string, dest: string) {
  fs.copyFileSync(
    path.join(CURRENT_DIR, filePath), 
    path.join(CURRENT_DIR, dest)
  );
}

export function deleteFile(filePath: string, absolutePath = false) {
  if (!absolutePath) {
    fs.rmSync(path.join(CURRENT_DIR, filePath));
  } else {
    fs.rmSync(filePath);
  }
}

export function createFile(filePath: string, content: string) {
  fs.createFileSync(filePath);
  fs.writeFileSync(filePath, content);
}

export function deleteDir(dirPath: string, recursive = false) {
  if (!fs.existsSync(dirPath)) {
    throw new Error('path does not exists: ' + dirPath);
  }

  fs.readdirSync(dirPath).forEach(fileName => {
    const filePath = !recursive
      ? path.join(CURRENT_DIR, dirPath, fileName)
      : path.join(dirPath, fileName);

    if (fs.lstatSync(filePath).isDirectory()) {
      deleteDir(filePath, true);
    } else {
      deleteFile(filePath, true);
    }
  }); 

  fs.rmdirSync(path.join(CURRENT_DIR, dirPath));
}