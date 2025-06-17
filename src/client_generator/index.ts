import { 
    copyFile,
    deleteDir,
    deleteFile,
    
} from "../utils";
import { execSync } from "child_process";
import { 
    CONTRACT_CLIENT_OUT_DIR
} from "../utils";
import path from "path";
import fs from 'fs-extra';

export function createClient(idlPath: string) {
  console.log('📦 Generating TypeScript client libraries and types from Sails IDL file ...');

  const toDelete = [
    'package.json',
    'tsconfig.json'
  ];

  execSync(`npx sails-js-cli generate ${idlPath} -o ${CONTRACT_CLIENT_OUT_DIR}`);
  copyFile(`${CONTRACT_CLIENT_OUT_DIR}/src/global.d.ts`, `${CONTRACT_CLIENT_OUT_DIR}/global.d.ts`);
  copyFile(`${CONTRACT_CLIENT_OUT_DIR}/src/lib.ts`, `${CONTRACT_CLIENT_OUT_DIR}/lib.ts`);
  deleteDir(`${CONTRACT_CLIENT_OUT_DIR}/src`);
  toDelete.forEach(file => deleteFile(`${CONTRACT_CLIENT_OUT_DIR}/${file}`));

  const clientCodePath = path.join(CONTRACT_CLIENT_OUT_DIR, 'lib.ts');
  let clientCode = fs.readFileSync(`${CONTRACT_CLIENT_OUT_DIR}/lib.ts`, 'utf8');
  clientCode = `import { ZERO_ADDRESS } from 'sails-js';\n` + clientCode;

  fs.writeFile(clientCodePath, clientCode);
}