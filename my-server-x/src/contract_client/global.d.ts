import { ActorId } from 'sails-js';

declare global {
  export type ContractResponse = "greenReceived" | "yellowReceived" | "redReceived";

  export interface StructTest {
    name: string;
    age: number | string | bigint;
  }

  export interface IoContractState {
    owner: ActorId;
    current_light: Light;
    callers: Array<[ActorId, Light]>;
  }

  export type Light = "green" | "red" | "yellow";

  export interface KeyringData {
    address: string;
    encoded: string;
  }

  export type KeyringEvent = 
    | { keyringAccountSet: null }
    | { error: KeyringError };

  export type KeyringError = "keyringAddressAlreadyEsists" | "userAddressAlreadyExists" | "userCodedNameAlreadyExists" | "userDoesNotHasKeyringAccount" | "keyringAccountAlreadyExists" | "sessionHasInvalidCredentials" | "userAndKeyringAddressAreTheSame";

  export type KeyringQueryEvent = 
    | { keyringAccountAddress: ActorId | null }
    | { keyringAccountData: KeyringData | null };
};