import path from "path";
import * as fs from 'fs'; 

export const CLIENT_ROOT = 'contract_client';
export const CURRENT_DIR = process.cwd();

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