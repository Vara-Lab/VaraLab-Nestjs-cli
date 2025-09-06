"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvFile = createEnvFile;
const utils_1 = require("../utils");
const path = require("path");
function createEnvFile(data) {
    const { nestJsPath, rpcUrl, sponsorName, sponsorMnemonic, nodeEnv, port, contractId, contractIdl, workerWaitingTime, initialTokensForVoucher, initialVoucherExpiration, minTokensForVoucher, tokensToAddToVOucher, newVoucherExpiration } = data;
    const envFilePath = path.join(nestJsPath, '.env');
    const code = `JWT_SECRET_KEY=
JWT_REFRESH_TOKEN_KEY=
NETWORK=${rpcUrl}
NODE_ENV=${nodeEnv}
PORT=${port}
SPONSOR_NAME=${sponsorName}
SPONSOR_MNEMONIC=${sponsorMnemonic}
WORKER_WAITING_TIME_IN_MS=${workerWaitingTime}
INITIAL_TOKENS_FOR_VOUCHER=${initialTokensForVoucher}
INITIAL_VOUCHER_EXPIRATION_TIME_IN_BLOCKS=${initialVoucherExpiration}
MIN_TOKENS_FOR_VOUCHER=${minTokensForVoucher}
TOKENS_TO_ADD_TO_VOUCHER=${tokensToAddToVOucher}
NEW_VOUCHER_EXPIRATION_TIME_IN_BLOCKS=${newVoucherExpiration}
CONTRACT_ADDRESS=${contractId}
CONTRACT_IDL='
${contractIdl}
'`;
    (0, utils_1.createFile)(envFilePath, code);
}
