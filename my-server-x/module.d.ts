declare namespace NodeJS {
  export interface ProcessEnv {
    jwtSecretKey: string;
    jwtRefreshTokenKey: string;
    RPC_URL: string;
    NODE_ENV: string;
    PORT: string;
    SPONSOR_NAME: string;
    SPONSOR_MNEMONIC: string;
    CONTRACT_ID: `0x${string}`;
    CONTRACT_IDL: string;
  }
}
  