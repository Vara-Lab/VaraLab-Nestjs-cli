import { GearApi, HexString } from "@gear-js/api";
import { 
    CONTRACT_ID, 
    IDL, 
    NETWORK, 
    SPONSOR_MNEMONIC, 
    SPONSOR_NAME 
} from "../consts.js";
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SailsCalls } from 'sailscalls';
import { SailsProgram } from "src/contract_client/lib";


@Injectable()
export class SailscallsService implements OnModuleInit, OnModuleDestroy {
    private sailsCalls: SailsCalls;
    private contractSailsProgram: SailsProgram;

    sailsClientProgram() {
        return this.contractSailsProgram;
    }

    sailsInstance() {
        return this.sailsCalls;
    }

    command() {
        return this.sailsCalls.command;
    }

    query() {
        return this.sailsCalls.query;
    }

    async checkVoucher(userAddress: HexString, voucherId: HexString) {
        const voucherIsExpired = await this.sailsCalls.voucherIsExpired(
            userAddress,
            voucherId,
        );

        if (voucherIsExpired) {
            await this.sailsCalls.renewVoucherAmountOfBlocks({
                userAddress,
                voucherId,
                numOfBlocks: 1200, // 1200 blocks = 1 hour
            })
        }

        const voucherBalance = await this.sailsCalls.voucherBalance(voucherId);

        if (voucherBalance < 1) {
            await this.sailsCalls.addTokensToVoucher({
                userAddress,
                voucherId,
                numOfTokens: 1
            });
        }
    }

    async onModuleInit() {
        const api =  await GearApi.create({ 
            providerAddress: NETWORK
        });

        this.sailsCalls = await SailsCalls.new({
            gearApi: api,
            voucherSignerData: {
                sponsorMnemonic: SPONSOR_MNEMONIC,
                sponsorName: SPONSOR_NAME
            },
            newContractsData: [
                {
                    contractName: 'traffic_light',
                    address: CONTRACT_ID,
                    idl: IDL
                }
            ]
        });

        this.contractSailsProgram = new SailsProgram(api, CONTRACT_ID);

        console.log('✅ Sailscalls and Client service has been initialized.');
    }

    async onModuleDestroy() {
        await this.sailsCalls.disconnectGearApi();
        console.log('Sailscalls service has been destroyed.');
    }
}
