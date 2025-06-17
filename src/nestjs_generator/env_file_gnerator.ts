import { createFile } from "../utils";
import path = require("path");

interface EnvData {
    nestJsPath: string;
    rpcUrl: string;
    nodeEnv: string;
    port: string;
    contractId: string;
    contractIdl: string;
}

export function createEnvFile(data: EnvData) {
    const {
        nestJsPath,
        rpcUrl,
        nodeEnv,
        port,
        contractId,
        contractIdl
    } = data;
    const envFilePath = path.join(nestJsPath, '.env');

    const code = `jwtSecretKey=
jwtRefreshTokenKey=
RPC_URL=${rpcUrl}
NODE_ENV=${nodeEnv}
PORT=${port}
SPONSOR_NAME=
SPONSOR_MNEMONIC=
CONTRACT_ID=${contractId}
CONTRACT_IDL='
${contractIdl}
'`;

    createFile(envFilePath, code);
}