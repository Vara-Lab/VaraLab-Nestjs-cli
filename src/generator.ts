import * as fs from 'fs';
import * as path from 'path';
import { ParsedIDL } from './parser';

export async function generateNestProject(parsedIDL: ParsedIDL, outputDir: string) {
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