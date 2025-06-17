import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { KeyringService } from './keyring.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
// import { QueryWard } from 'src/auth/guards/query.guard';
import { HexString } from '@gear-js/api';

@Controller('keyring')
export class KeyringController {
    constructor(private keyringService: KeyringService) {}

    @UseGuards(JwtGuard)
    @Get(':address')
    async getWalletData(@Param('address') address: HexString) {
        console.log('smna si paso a obtener la info');
        return await this.keyringService.keyringDataByAddress(address);
    }
}
