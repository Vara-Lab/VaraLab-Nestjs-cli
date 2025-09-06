import { createFile } from "../utils";
import path = require("path");

interface EnvData {
    nestJsPath: string;
    rpcUrl: string;
    sponsorName: string,
    sponsorMnemonic: string,
    nodeEnv: string;
    port: number;
    contractId: string;
    contractIdl: string;
    workerWaitingTime: string;
    initialTokensForVoucher: number;
    initialVoucherExpiration: number;
    minTokensForVoucher: number;
    tokensToAddToVOucher: number;
    newVoucherExpiration: number;
}

export function createEnvFile(data: EnvData) {
    const {
        nestJsPath,
        rpcUrl,
        sponsorName,
        sponsorMnemonic,
        nodeEnv,
        port,
        contractId,
        contractIdl,
        workerWaitingTime,
        initialTokensForVoucher,
        initialVoucherExpiration,
        minTokensForVoucher,
        tokensToAddToVOucher,
        newVoucherExpiration
    } = data;
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

    createFile(envFilePath, code);
}
