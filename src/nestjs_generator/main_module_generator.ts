import { createFile } from "../utils";
import path from "path";

export function createMainModule(nestjsSrcPath: string, serviceNames: string[]) {
    const lines: string[] = [];
    const mainModuleFilePath = path.join(nestjsSrcPath, 'app.module.ts');

    lines.push(`import { Module } from '@nestjs/common';`);
    lines.push(`import { AppController } from './app.controller';`);
    lines.push(`import { ConfigModule } from '@nestjs/config';`);
    lines.push(`import { AuthModule } from './auth/auth.module';`);
    lines.push(`import { KeyringModule } from './keyring/keyring.module';`);
    lines.push(`import { VoucherModule } from './Voucher/voucher.module';`);
    lines.push(`import { SailscallsService } from './SailscallsService/sailscallsClient.service';`);
    lines.push(`import { VouchersWorkerService } from './VouchersWorkerService/vouchers_worker.service';`);

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
    lines.push(`        VoucherModule,`);

    serviceNames.forEach(moduleName => {
        lines.push(`        ${moduleName}Module,`);
    });

    lines.push(`    ],`);
    lines.push(`    controllers: [AppController],`);
    lines.push(`    providers: [SailscallsService, VouchersWorkerService],`);
    lines.push(`})`);
    lines.push(`export class AppModule {}`);

    createFile(mainModuleFilePath, lines.join('\n'));
}
