import { HexString } from '@gear-js/api';
import * as dotenv from 'dotenv';

dotenv.config();

export const INITIAL_BLOCKS_FOR_VOUCHER: number = 1_200; // one hour
export const INITIAL_VOUCHER_TOKENS: number = 2;
export const NETWORK: string = process.env.RPC_URL;
export const SPONSOR_NAME: string = process.env.SPONSOR_NAME;
export const SPONSOR_MNEMONIC: string = process.env.SPONSOR_MNEMONIC;
export const CONTRACT_ID: HexString = process.env.CONTRACT_ID;
export const IDL: string = process.env.CONTRACT_IDL;