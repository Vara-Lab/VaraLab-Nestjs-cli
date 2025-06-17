import { HexString } from "@gear-js/api";

export class KeyringData {
    keyringAddress: HexString;
    keyringVoucherId: HexString;
    lockedKeyringData: any;
    password: string
}