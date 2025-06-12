"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNestProject = generateNestProject;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function generateNestProject(parsedIDL, outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });
    const servicesDir = path.join(outputDir, 'src/services');
    fs.mkdirSync(servicesDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify({
        name: "generated-nestjs-server",
        version: "0.1.0",
        scripts: { start: "nest start" }
    }, null, 2));
    parsedIDL.services.forEach(service => {
        const serviceFile = path.join(servicesDir, `${service.name}.service.ts`);
        const serviceContent = `
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${service.name}Service {
${service.methods.map(method => `
  ${method.name}(${method.params.join(', ')}): string {
    return 'Response from ${method.name}';
  }
`).join('\n')}
}
`;
        fs.writeFileSync(serviceFile, serviceContent);
    });
    const mainFile = `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
`;
    fs.mkdirSync(path.join(outputDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'src/main.ts'), mainFile);
    const appModuleFile = `
import { Module } from '@nestjs/common';
${parsedIDL.services.map(service => `import { ${service.name}Service } from './services/${service.name}.service';`).join('\n')}

@Module({
  providers: [
    ${parsedIDL.services.map(service => `${service.name}Service`).join(',\n')}
  ],
})
export class AppModule {}
`;
    fs.writeFileSync(path.join(outputDir, 'src/app.module.ts'), appModuleFile);
}
