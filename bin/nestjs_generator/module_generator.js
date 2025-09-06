"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleGenerator = moduleGenerator;
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function moduleGenerator(serviceName, nestjsSrcPath, idlProgram, port) {
    const serviceNameLowerCase = serviceName.toLocaleLowerCase();
    const modulePath = path_1.default.join(nestjsSrcPath, serviceNameLowerCase);
    const moduleFilePath = path_1.default.join(modulePath, `${serviceNameLowerCase}.module.ts`);
    const controllerFilePath = path_1.default.join(modulePath, `${serviceNameLowerCase}.controller.ts`);
    const serviceFilePath = path_1.default.join(modulePath, `${serviceNameLowerCase}.service.ts`);
    const serviceCommandNames = idlProgram.getServiceCommandsNames(serviceName);
    const serviceQueryNames = idlProgram.getServiceQueriesNames(serviceName);
    const nestjsModuleFileCode = baseModuleCode(serviceName);
    const nestJsControllerData = createController(idlProgram, serviceName, serviceCommandNames, serviceQueryNames, port);
    const nestjsServiceCode = createServiceCode(idlProgram, serviceName, serviceCommandNames, serviceQueryNames);
    fs_extra_1.default.mkdir(modulePath);
    (0, utils_1.createFile)(moduleFilePath, nestjsModuleFileCode);
    (0, utils_1.createFile)(controllerFilePath, nestJsControllerData.code);
    (0, utils_1.createFile)(serviceFilePath, nestjsServiceCode);
    return nestJsControllerData.urls;
    // nestJsControllerData.urls.forEach(data => {
    //     console.log(`${data.isQuery ? 'Query: ':'Command: '}${data.url}`);
    // });
}
function baseModuleCode(serviceName) {
    return `import { Module } from '@nestjs/common';
import { ${serviceName}Controller } from './${serviceName.toLowerCase()}.controller';
import { ${serviceName}Service } from './${serviceName.toLowerCase()}.service';
import { SailscallsService } from '../SailscallsService/sailscallsClient.service';
import { VouchersWorkerService } from '../VouchersWorkerService/vouchers_worker.service';
import { VoucherService } from '../Voucher/voucher.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [${serviceName}Controller],
  providers: [
    ${serviceName}Service, 
    SailscallsService, 
    JwtService, 
    VouchersWorkerService,
    VoucherService
  ]
})
export class ${serviceName}Module {}`;
}
function createController(idlProgram, serviceName, commandNames, queryNames, port) {
    const lines = [];
    const functionsUrl = [];
    const serviceNameLower = serviceName.toLowerCase();
    const nestJsServiceName = `${serviceName}Service`;
    lines.push(`import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';`);
    lines.push(`import { ${nestJsServiceName} } from './${serviceNameLower}.service';`);
    lines.push(`import { JwtGuard } from 'src/auth/guards/jwt.guard';`);
    lines.push(`@Controller('${serviceNameLower}')`);
    lines.push(`export class ${serviceName}Controller {`);
    lines.push(`    constructor(private ${serviceNameLower}Service: ${nestJsServiceName}) {}`);
    commandNames.forEach(commandName => {
        const commandNameLower = commandName.toLowerCase();
        lines.push(`    @UseGuards(JwtGuard)`);
        lines.push(`    @Post('command/${commandNameLower}')`);
        lines.push(`    async ${commandNameLower}(@Body() data: any) {`);
        if (idlProgram.serviceFuncContainsParams(serviceName, commandName)) {
            lines.push(`        return this.${serviceNameLower}Service.${commandNameLower}Call(data.user.sub, data.callArguments);`);
        }
        else {
            lines.push(`        return this.${serviceNameLower}Service.${commandNameLower}Call(data.user.sub);`);
        }
        lines.push(`    }`);
        functionsUrl.push({
            serviceName,
            funcName: commandName,
            url: `https://localhost:${port}/${serviceNameLower}/command/${commandNameLower}`,
            isQuery: false
        });
    });
    queryNames.forEach(queryName => {
        const queryNameLower = queryName.toLowerCase();
        lines.push(`    @Get('query/${queryNameLower}')`);
        if (idlProgram.serviceFuncContainsParams(serviceName, queryName)) {
            lines.push(`    async ${queryNameLower}(@Body() data: any) {`);
            lines.push(`        return this.${serviceNameLower}Service.${queryNameLower}Call(data.callArguments);`);
        }
        else {
            lines.push(`    async ${queryNameLower}() {`);
            lines.push(`        return this.${serviceNameLower}Service.${queryNameLower}Call();`);
        }
        lines.push(`    }`);
        functionsUrl.push({
            serviceName,
            funcName: queryName,
            url: `https://localhost:${port}/${serviceNameLower}/query/${queryNameLower}`,
            isQuery: true
        });
    });
    lines.push('}');
    return {
        code: lines.join('\n'),
        urls: functionsUrl
    };
}
function createServiceCode(idlProgram, serviceName, commandNames, queryNames) {
    const lines = [];
    const nestJsServiceName = `${serviceName}Service`;
    lines.push(`import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';`);
    lines.push(`import { SailscallsService } from '../SailscallsService/sailscallsClient.service';`);
    lines.push(`import { KeyringData } from 'src/keyring/dto/keyring.dto';`);
    lines.push(`import { VoucherService } from '../Voucher/voucher.service';`);
    lines.push(`import type { KeyringPair } from '@polkadot/keyring/types';`);
    lines.push(`@Injectable()`);
    lines.push(`export class ${nestJsServiceName} {`);
    lines.push(`    constructor(`);
    lines.push(`        private sailsCallsService: SailscallsService,`);
    lines.push(`        private voucherService: VoucherService`);
    lines.push(`    ) {}`);
    commandNames.forEach(commandName => {
        createServiceCommandFunc(idlProgram, lines, serviceName, commandName);
    });
    queryNames.forEach(queryName => {
        createServiceQueryFunc(idlProgram, lines, serviceName, queryName);
    });
    lines.push('}');
    return lines.join('\n');
}
function createServiceCommandFunc(idlProgram, lines, serviceName, commandName) {
    const commandNameLower = commandName.toLowerCase();
    if (idlProgram.serviceFuncContainsParams(serviceName, commandName)) {
        lines.push(`    async ${commandNameLower}Call(signerData: KeyringData, funcArguments: any[]) {`);
    }
    else {
        lines.push(`    async ${commandNameLower}Call(signerData: KeyringData) {`);
    }
    lines.push(`        const sailscallsInstance = this.sailsCallsService.sailsInstance;`);
    lines.push(`        try {`);
    lines.push(`            await this.voucherService.updateVoucher({`);
    lines.push(`                userAddress: signerData.keyringAddress,`);
    lines.push(`                voucherId: signerData.keyringVoucherId`);
    lines.push(`            });`);
    lines.push(`        } catch (e) {`);
    lines.push(`            throw new UnauthorizedException('Voucher is not set for user: ', JSON.stringify(e));`);
    lines.push(`        }`);
    lines.push(`        let signer: KeyringPair;`);
    lines.push(`        try {`);
    lines.push(`            signer = sailscallsInstance.unlockKeyringPair(`);
    lines.push(`                signerData.lockedKeyringData,`);
    lines.push(`                signerData.password`);
    lines.push(`            );`);
    lines.push(`        } catch(e) {`);
    lines.push(`            throw new UnauthorizedException();`);
    lines.push(`        }`);
    lines.push(`        try {`);
    lines.push(`            const response = await sailscallsInstance.command({`);
    lines.push(`                serviceName: '${serviceName}',`);
    lines.push(`                methodName: '${commandName}',`);
    lines.push(`                signerData: signer,`);
    lines.push(`                voucherId: signerData.keyringVoucherId,`);
    lines.push(`                callArguments: [`);
    // lines.push(`                    signerData.keyringAddress,`);
    if (idlProgram.serviceFuncContainsParams(serviceName, commandName)) {
        lines.push(`                    ...funcArguments`);
    }
    lines.push(`                ],`);
    lines.push(`            });`);
    lines.push(`            return {`);
    lines.push(`                message: '${commandNameLower} command call',`);
    lines.push(`                contractMessage: response`);
    lines.push(`            }`);
    lines.push(`        } catch (e) {`);
    lines.push(`            const error = e as Error;`);
    lines.push(`            throw new InternalServerErrorException({`);
    lines.push(`                message: 'Error sending message',`);
    lines.push(`                sailsCallsError: error.message`);
    lines.push(`            });`);
    lines.push(`        }`);
    lines.push(`    }`);
}
function createServiceQueryFunc(idlProgram, lines, serviceName, queryName) {
    const queryNameLower = queryName.toLowerCase();
    if (idlProgram.serviceFuncContainsParams(serviceName, queryName)) {
        lines.push(`    async ${queryNameLower}Call(funcArguments: any[]) {`);
    }
    else {
        lines.push(`    async ${queryNameLower}Call() {`);
    }
    lines.push(`        try {`);
    lines.push(`            const response = await this.sailsCallsService.query()({`);
    lines.push(`                serviceName: '${serviceName}',`);
    lines.push(`                methodName: '${queryName}',`);
    if (idlProgram.serviceFuncContainsParams(serviceName, queryName)) {
        lines.push(`                callArguments: [`);
        lines.push(`                    ...funcArguments,`);
        lines.push(`                ],`);
    }
    lines.push(`            });`);
    lines.push(`            return {`);
    lines.push(`                message: '${queryNameLower} query call',`);
    lines.push(`                contractMessage: response`);
    lines.push(`            }`);
    lines.push(`        } catch(e) {`);
    lines.push(`            throw new InternalServerErrorException('Error getting state');`);
    lines.push(`        }`);
    lines.push(`    }`);
}
