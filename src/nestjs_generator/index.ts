import * as fs from 'fs';
import path from 'path';
// import { ParsedIDL } from './parser';
// import { packageJsonData } from './nestjs_data';
// import { Program } from 'sails-js-parser';
import { IdlProgram } from '../IdlProgram';
import { rootFilesAndContent } from '../nestjs_data';
import { pathExists } from '../utils';


export async function generateNestProject(idlProgram: IdlProgram, serverName: string, outDir: string) {
  const nestjsPath = path.join(outDir, serverName);
  console.log('Path to create nest:');
  console.log(nestjsPath);

  if (pathExists(nestjsPath)) {
    throw new Error(`Directory ${serverName} already exists`);
  }

  fs.mkdirSync(nestjsPath);

  for (const rootFile of rootFilesAndContent) {
    const filePath = path.join(nestjsPath, rootFile.name);
    fs.writeFileSync(filePath, rootFile.content);
  }
}

// export async function generateNestProject(idlProgram: IdlProgram, outputDir: string) {
//   fs.mkdirSync(outputDir, { recursive: true });
//   const servicesDir = path.join(outputDir, 'src/services');
//   fs.mkdirSync(servicesDir, { recursive: true });
//   fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJsonData, null, 2));

//   parser.services.forEach(service => {
//     const serviceFile = path.join(servicesDir, `${service.name}.service.ts`);
// service
//     const serviceContent = `
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ${service.name}Service {
// ${service.funcs.map(method => `
//   ${method.name}(${method.params.join(', ')}): string {
//     return 'Response from ${method.name}';
//   }
// `).join('\n')}
// }
// `;
//     fs.writeFileSync(serviceFile, serviceContent);
//   });

//   const mainFile = `
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
// `;
//   fs.mkdirSync(path.join(outputDir, 'src'), { recursive: true });
//   fs.writeFileSync(path.join(outputDir, 'src/main.ts'), mainFile);

//   const appModuleFile = `
// import { Module } from '@nestjs/common';
// ${parser.services.map(service => `import { ${service.name}Service } from './services/${service.name}.service';`).join('\n')}

// @Module({
//   providers: [
//     ${parser.services.map(service => `${service.name}Service`).join(',\n')}
//   ],
// })
// export class AppModule {}
// `;
//   fs.writeFileSync(path.join(outputDir, 'src/app.module.ts'), appModuleFile);
// }