import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SailscallsService } from 'src/sailscallsClientService/sailscallsClient.service';
import { KeyringData } from 'src/keyring/dto/keyring.dto';
import type { KeyringPair } from '@polkadot/keyring/types'
@Injectable()
export class TrafficLightService {
    constructor(private sailsCallsService: SailscallsService) {}
    async greenCall(signerData: KeyringData) {
        const sailscallsInstance = this.sailsCallsService.sailsInstance();
        try {
            await this.sailsCallsService.checkVoucher(
                signerData.keyringAddress,
                signerData.keyringVoucherId
            );
        } catch (e) {
            throw new UnauthorizedException('Voucher is not set for user: ', JSON.stringify(e));
        }
        let signer: KeyringPair;
        try {
            signer = sailscallsInstance.unlockKeyringPair(
                signerData.lockedKeyringData,
                signerData.password
            );
        } catch(e) {
            throw new UnauthorizedException();
        }
        try {
            const response = await sailscallsInstance.command({
                serviceName: 'TrafficLight',
                methodName: 'Green',
                signerData: signer,
                voucherId: signerData.keyringVoucherId,
                callArguments: [
                    signerData.keyringAddress,
                ],
            });
            return {
                message: 'green command call',
                contractMessage: response
            }
        } catch (e) {
            const error = e as Error;
            throw new InternalServerErrorException({
                message: 'Error sending message',
                sailsCallsError: error.message
            });
        }
    }
    async randomfunccommandCall(signerData: KeyringData, funcArguments: any[]) {
        const sailscallsInstance = this.sailsCallsService.sailsInstance();
        try {
            await this.sailsCallsService.checkVoucher(
                signerData.keyringAddress,
                signerData.keyringVoucherId
            );
        } catch (e) {
            throw new UnauthorizedException('Voucher is not set for user: ', JSON.stringify(e));
        }
        let signer: KeyringPair;
        try {
            signer = sailscallsInstance.unlockKeyringPair(
                signerData.lockedKeyringData,
                signerData.password
            );
        } catch(e) {
            throw new UnauthorizedException();
        }
        try {
            const response = await sailscallsInstance.command({
                serviceName: 'TrafficLight',
                methodName: 'RandomFuncCommand',
                signerData: signer,
                voucherId: signerData.keyringVoucherId,
                callArguments: [
                    signerData.keyringAddress,
                    ...funcArguments
                ],
            });
            return {
                message: 'randomfunccommand command call',
                contractMessage: response
            }
        } catch (e) {
            const error = e as Error;
            throw new InternalServerErrorException({
                message: 'Error sending message',
                sailsCallsError: error.message
            });
        }
    }
    async redCall(signerData: KeyringData) {
        const sailscallsInstance = this.sailsCallsService.sailsInstance();
        try {
            await this.sailsCallsService.checkVoucher(
                signerData.keyringAddress,
                signerData.keyringVoucherId
            );
        } catch (e) {
            throw new UnauthorizedException('Voucher is not set for user: ', JSON.stringify(e));
        }
        let signer: KeyringPair;
        try {
            signer = sailscallsInstance.unlockKeyringPair(
                signerData.lockedKeyringData,
                signerData.password
            );
        } catch(e) {
            throw new UnauthorizedException();
        }
        try {
            const response = await sailscallsInstance.command({
                serviceName: 'TrafficLight',
                methodName: 'Red',
                signerData: signer,
                voucherId: signerData.keyringVoucherId,
                callArguments: [
                    signerData.keyringAddress,
                ],
            });
            return {
                message: 'red command call',
                contractMessage: response
            }
        } catch (e) {
            const error = e as Error;
            throw new InternalServerErrorException({
                message: 'Error sending message',
                sailsCallsError: error.message
            });
        }
    }
    async yellowCall(signerData: KeyringData) {
        const sailscallsInstance = this.sailsCallsService.sailsInstance();
        try {
            await this.sailsCallsService.checkVoucher(
                signerData.keyringAddress,
                signerData.keyringVoucherId
            );
        } catch (e) {
            throw new UnauthorizedException('Voucher is not set for user: ', JSON.stringify(e));
        }
        let signer: KeyringPair;
        try {
            signer = sailscallsInstance.unlockKeyringPair(
                signerData.lockedKeyringData,
                signerData.password
            );
        } catch(e) {
            throw new UnauthorizedException();
        }
        try {
            const response = await sailscallsInstance.command({
                serviceName: 'TrafficLight',
                methodName: 'Yellow',
                signerData: signer,
                voucherId: signerData.keyringVoucherId,
                callArguments: [
                    signerData.keyringAddress,
                ],
            });
            return {
                message: 'yellow command call',
                contractMessage: response
            }
        } catch (e) {
            const error = e as Error;
            throw new InternalServerErrorException({
                message: 'Error sending message',
                sailsCallsError: error.message
            });
        }
    }
    async contractownerCall() {
        try {
            const response = await this.sailsCallsService.query()({
                serviceName: 'TrafficLight',
                methodName: 'ContractOwner',
            });
            return {
                message: 'contractowner query call',
                contractMessage: response
            }
        } catch(e) {
            throw new InternalServerErrorException('Error getting state');
        }
    }
    async randomfuncqueryCall(funcArguments: any[]) {
        try {
            const response = await this.sailsCallsService.query()({
                serviceName: 'TrafficLight',
                methodName: 'RandomFuncQuery',
                callArguments: [
                    ...funcArguments,
                ],
            });
            return {
                message: 'randomfuncquery query call',
                contractMessage: response
            }
        } catch(e) {
            throw new InternalServerErrorException('Error getting state');
        }
    }
    async trafficlightCall() {
        try {
            const response = await this.sailsCallsService.query()({
                serviceName: 'TrafficLight',
                methodName: 'TrafficLight',
            });
            return {
                message: 'trafficlight query call',
                contractMessage: response
            }
        } catch(e) {
            throw new InternalServerErrorException('Error getting state');
        }
    }
}