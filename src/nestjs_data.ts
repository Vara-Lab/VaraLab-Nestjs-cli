export interface FileData {
  name: string;
  content: string;
}

export const keyringServiceMethods = [
  'BindKeyringDataToUserAddress',
  'BindKeyringDataToUserCodedName',
  'KeyringAccountData',
  'KeyringAddressFromUserAddress',
  'KeyringAddressFromUserCodedName'
];

export const packageJsonData = {
  "name": "nestjs_server",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@gear-js/api": "^0.42.0",
    "@nestjs/common": "^11.1.3",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.1.3",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/platform-express": "^11.1.3",
    "@polkadot/api": "^15.9.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "cookie-parser": "^1.4.7",
    "crypto-js": "^4.2.0",
    "dotenv": "^16.5.0",
    "passport-google-oauth20": "^2.0.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.2",
    "sails-js": "0.4.2",
    "sailscalls": "github:Vara-Lab/SailsCalls"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "@eslint/js": "^9.28.0",
    "@nestjs/cli": "^11.0.7",
    "@nestjs/schematics": "^11.0.5",
    "@nestjs/testing": "^11.1.3",
    "@polkadot/keyring": "^13.5.1",
    "@polkadot/types": "^15.10.2",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.11.31",
    "@types/cookie-parser": "^1.4.9",
    "@types/crypto-js": "^4.2.2",
    "@types/express": "^5.0.3",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.15.30",
    "@types/passport-google-oauth20": "^2.0.16",
    "@types/supertest": "^6.0.3",
    "eslint": "^9.28.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-prettier": "^5.4.1",
    "globals": "^16.2.0",
    "jest": "^29.7.0",
    "prettier": "^3.5.3",
    "source-map-support": "^0.5.21",
    "supertest": "^7.1.1",
    "ts-jest": "^29.3.4",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.34.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

export const rootFilesAndContent: FileData[] = [
  {
    name: '.env',
    content: `JWT_SECRET_KEY=
JWT_REFRESH_TOKEN_KEY=
RPC_URL=
NODE_ENV=development
PORT=
SPONSOR_NAME=
SPONSOR_MNEMONIC=
CONTRACT_ID=
CONTRACT_IDL=`
  },
  {
    name: '.gitignore',
    content: `/node_modules
/dist`,
  },
  {
    name: 'eslint.config.mjs',
    content: `// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);`
  },
  {
    name: 'module.d.ts',
    content: `declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET_KEY: string;
    JWT_REFRESH_TOKEN_KEY: string;
    RPC_URL: string;
    NODE_ENV: string;
    PORT: string;
    SPONSOR_NAME: string;
    SPONSOR_MNEMONIC: string;
    CONTRACT_ID: \`0x\${string}\`;
    CONTRACT_IDL: string;
  }
}`
  },
  {
    name: 'nest-cli.json',
    content: `{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}`
  },
  {
    name: 'package.json',
    content: JSON.stringify(packageJsonData, null, 2)
  },
  {
    name: 'README.md',
    content: `# Nestestjs server

The nestjs server contains a \`.env\` file where you can find the jwt secrets key and the port.

To install all dependencies, use:

\`\`\`bash
pnpm i
\`\`\`

To run the server in development mode, use

\`\`\`bash
pnpm run start:dev
\`\`\`

## Server structure

### Modules:

- auth: this module contains all the login to register, login and manage the jwt tokens from the users, it contains some to protect all the apis 
  that need verification from the user.
- keyring: this module handles all the keyring methos from the keyring service in the contract, it creates all the user wallets, handles the keyring
  data, etc.

### Services:

- sailscallsService: this service gives the instance of SailsCalls, it helps you to send messages, queries, handle the vouchers and keyring accounts,
  you can use this service in all your module if you need to send messages to your contract.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>`
  },
  {
    name: 'tsconfig.build.json',
    content: `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}`
  },
  {
    name: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}`
  }
]

export const srcFiles: FileData[] = [
  {
    name: 'app.controller.ts',
    content: `import { 
  Controller, 
  Post, 
  Body 
} from '@nestjs/common';

@Controller()
export class AppController {
  @Post('/')
  receiveHello(@Body() data: any): string {
    return 'Hello!';
  }
}`
  },
  {
    name: 'app.module.ts',
    content: `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { KeyringModule } from './keyring/keyring.module';
import { ConfigModule } from '@nestjs/config';
import { SailscallsService } from './sailscallsClientService/sailscallsClient.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    KeyringModule, 
  ],
  controllers: [AppController],
  providers: [SailscallsService],
})
export class AppModule {}`
  },
  {
    name: 'consts.ts',
    content: `import { HexString } from '@gear-js/api';
import * as dotenv from 'dotenv';

dotenv.config();

export const INITIAL_BLOCKS_FOR_VOUCHER: number = 1_200; // one hour
export const INITIAL_VOUCHER_TOKENS: number = 2;
export const NETWORK: string = process.env.RPC_URL;
export const SPONSOR_NAME: string = process.env.SPONSOR_NAME;
export const SPONSOR_MNEMONIC: string = process.env.SPONSOR_MNEMONIC;
export const CONTRACT_ID: HexString = process.env.CONTRACT_ID;
export const IDL: string = process.env.CONTRACT_IDL;`
  },
  {
    name: 'main.ts',
    content: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  });
  //  app.enableCors({
  //     origin: 'http://localhost', // Poner la URL de tu WordPress
  //     methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  //     allowedHeaders: 'Content-Type,Authorization',
      
  // });

  await app.listen(process.env.PORT ?? 3000);

  process.on('SIGINT', async () => {
    console.log('\nClosing server...');
    await app.close();
  });
}
bootstrap();`
  }
];