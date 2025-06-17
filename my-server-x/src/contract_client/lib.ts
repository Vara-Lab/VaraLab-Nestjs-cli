import { ZERO_ADDRESS } from 'sails-js';
import { GearApi, Program, HexString, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, ActorId, throwOnErrorReply } from 'sails-js';

export class SailsProgram {
  public readonly registry: TypeRegistry;
  public readonly trafficLight: TrafficLight;
  public readonly keyringService: KeyringService;
  private _program: Program;

  constructor(public api: GearApi, programId?: `0x${string}`) {
    const types: Record<string, any> = {
      ContractResponse: {"_enum":["GreenReceived","YellowReceived","RedReceived"]},
      StructTest: {"name":"String","age":"u128"},
      IoContractState: {"owner":"[u8;32]","current_light":"Light","callers":"Vec<([u8;32], Light)>"},
      Light: {"_enum":["Green","Red","Yellow"]},
      KeyringData: {"address":"String","encoded":"String"},
      KeyringEvent: {"_enum":{"KeyringAccountSet":"Null","Error":"KeyringError"}},
      KeyringError: {"_enum":["KeyringAddressAlreadyEsists","UserAddressAlreadyExists","UserCodedNameAlreadyExists","UserDoesNotHasKeyringAccount","KeyringAccountAlreadyExists","SessionHasInvalidCredentials","UserAndKeyringAddressAreTheSame"]},
      KeyringQueryEvent: {"_enum":{"KeyringAccountAddress":"Option<[u8;32]>","KeyringAccountData":"Option<KeyringData>"}},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.trafficLight = new TrafficLight(this);
    this.keyringService = new KeyringService(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  newCtorFromCode(code: Uint8Array | Buffer | HexString): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
      async (programId) =>  {
        this._program = await Program.new(programId, this.api);
      }
    );
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
      async (programId) =>  {
        this._program = await Program.new(programId, this.api);
      }
    );
    return builder;
  }
}

export class TrafficLight {
  constructor(private _program: SailsProgram) {}

  public green(): TransactionBuilder<ContractResponse> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<ContractResponse>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['TrafficLight', 'Green'],
      '(String, String)',
      'ContractResponse',
      this._program.programId
    );
  }

  public randomFuncCommand(user_address: ActorId, string_t: string, number: number, data: StructTest, strings_vec: Array<string>): TransactionBuilder<[ActorId, string, number, StructTest, Array<string>]> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<[ActorId, string, number, StructTest, Array<string>]>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['TrafficLight', 'RandomFuncCommand', user_address, string_t, number, data, strings_vec],
      '(String, String, [u8;32], String, u32, StructTest, Vec<String>)',
      '([u8;32], String, u32, StructTest, Vec<String>)',
      this._program.programId
    );
  }

  public red(): TransactionBuilder<ContractResponse> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<ContractResponse>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['TrafficLight', 'Red'],
      '(String, String)',
      'ContractResponse',
      this._program.programId
    );
  }

  public yellow(): TransactionBuilder<ContractResponse> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<ContractResponse>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['TrafficLight', 'Yellow'],
      '(String, String)',
      'ContractResponse',
      this._program.programId
    );
  }

  public async contractOwner(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<ActorId> {
    const payload = this._program.registry.createType('(String, String)', ['TrafficLight', 'ContractOwner']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, [u8;32])', reply.payload);
    return result[2].toJSON() as unknown as ActorId;
  }

  public async randomFuncQuery(string_t: string, number: number, data: StructTest, strings_vec: Array<string>, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<[string, number, StructTest, Array<string>]> {
    const payload = this._program.registry.createType('(String, String, String, u32, StructTest, Vec<String>)', ['TrafficLight', 'RandomFuncQuery', string_t, number, data, strings_vec]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, (String, u32, StructTest, Vec<String>))', reply.payload);
    return result[2].toJSON() as unknown as [string, number, StructTest, Array<string>];
  }

  public async trafficLight(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<IoContractState> {
    const payload = this._program.registry.createType('(String, String)', ['TrafficLight', 'TrafficLight']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, IoContractState)', reply.payload);
    return result[2].toJSON() as unknown as IoContractState;
  }
}

export class KeyringService {
  constructor(private _program: SailsProgram) {}

  public bindKeyringDataToUserAddress(user_address: ActorId, keyring_data: KeyringData): TransactionBuilder<KeyringEvent> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<KeyringEvent>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['KeyringService', 'BindKeyringDataToUserAddress', user_address, keyring_data],
      '(String, String, [u8;32], KeyringData)',
      'KeyringEvent',
      this._program.programId
    );
  }

  public bindKeyringDataToUserCodedName(user_coded_name: string, keyring_data: KeyringData): TransactionBuilder<KeyringEvent> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<KeyringEvent>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['KeyringService', 'BindKeyringDataToUserCodedName', user_coded_name, keyring_data],
      '(String, String, String, KeyringData)',
      'KeyringEvent',
      this._program.programId
    );
  }

  public async keyringAccountData(keyring_address: ActorId, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<KeyringQueryEvent> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['KeyringService', 'KeyringAccountData', keyring_address]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, KeyringQueryEvent)', reply.payload);
    return result[2].toJSON() as unknown as KeyringQueryEvent;
  }

  public async keyringAddressFromUserAddress(user_address: ActorId, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<KeyringQueryEvent> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['KeyringService', 'KeyringAddressFromUserAddress', user_address]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, KeyringQueryEvent)', reply.payload);
    return result[2].toJSON() as unknown as KeyringQueryEvent;
  }

  public async keyringAddressFromUserCodedName(user_coded_name: string, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<KeyringQueryEvent> {
    const payload = this._program.registry.createType('(String, String, String)', ['KeyringService', 'KeyringAddressFromUserCodedName', user_coded_name]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, KeyringQueryEvent)', reply.payload);
    return result[2].toJSON() as unknown as KeyringQueryEvent;
  }
}