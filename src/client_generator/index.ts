import { 
    copyFile,
    deleteDir,
    deleteFile
} from "../utils";
import { execSync } from "child_process";
import { 
    CLIENT_ROOT,
} from "../utils";

export function createClient(idlPath: string) {
  console.log('📦 Generating TypeScript client libraries from Sails IDL file ...');

  const toDelete = [
    'package.json',
    'tsconfig.json'
  ];

  execSync(`npx sails-js-cli generate ${idlPath} -o contract_client`);
  copyFile(`${CLIENT_ROOT}/src/global.d.ts`, `${CLIENT_ROOT}/global.d.ts`);
  copyFile(`${CLIENT_ROOT}/src/lib.ts`, `${CLIENT_ROOT}/lib.ts`);
  deleteDir(`${CLIENT_ROOT}/src`);
  toDelete.forEach(file => deleteFile(`${CLIENT_ROOT}/${file}`));
}