"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainModule = createMainModule;
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
function createMainModule(nestjsSrcPath, serviceNames) {
    const lines = [];
    const mainModuleFilePath = path_1.default.join(nestjsSrcPath, 'app.module.ts');
    lines.push(`import { Module } from '@nestjs/common';`);
    lines.push(`import { AppController } from './app.controller';`);
    lines.push(`import { AuthModule } from './auth/auth.module';`);
    lines.push(`import { KeyringModule } from './keyring/keyring.module';`);
    lines.push(`import { ConfigModule } from '@nestjs/config';`);
    lines.push(`import { SailscallsService } from './sailscallsClientService/sailscallsClient.service';`);
    serviceNames.forEach(moduleName => {
        const serviceLowerName = moduleName.toLowerCase();
        lines.push(`import { ${moduleName}Module } from './${serviceLowerName}/${serviceLowerName}.module';`);
    });
    lines.push(`@Module({`);
    lines.push(`    imports: [`);
    lines.push(`        ConfigModule.forRoot({`);
    lines.push(`            isGlobal: true,`);
    lines.push(`        }),`);
    lines.push(`        AuthModule,`);
    lines.push(`        KeyringModule,`);
    serviceNames.forEach(moduleName => {
        lines.push(`        ${moduleName}Module,`);
    });
    lines.push(`    ],`);
    lines.push(`    controllers: [AppController],`);
    lines.push(`    providers: [SailscallsService],`);
    lines.push(`})`);
    lines.push(`export class AppModule {}`);
    (0, utils_1.createFile)(mainModuleFilePath, lines.join('\n'));
}
