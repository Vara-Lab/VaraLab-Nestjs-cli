"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvFile = createEnvFile;
const utils_1 = require("../utils");
const path = require("path");
function createEnvFile(data) {
    const { nestJsPath, rpcUrl, nodeEnv, port, contractId, contractIdl } = data;
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
    (0, utils_1.createFile)(envFilePath, code);
}
