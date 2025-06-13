import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

interface GenerateDtosOptions {
  globalDtsPath: string;
  dtoOutputPath: string;
}

export function generateDtos(options: GenerateDtosOptions) {
  console.log('📝 Generating DTOs from global.d.ts ...');
  console.log(`Source: ${options.globalDtsPath}`);
  console.log(`Output folder: ${options.dtoOutputPath}`);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(options.globalDtsPath);

  const interfaces = sourceFile.getInterfaces();

  // Limpiar folder DTO
  fs.rmSync(options.dtoOutputPath, { recursive: true, force: true });
  fs.mkdirSync(options.dtoOutputPath, { recursive: true });

  interfaces.forEach(iface => {
    const structName = iface.getName();
    const properties = iface.getProperties();

    const lines: string[] = [];
    lines.push(`import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, ValidateIf } from 'class-validator';`);
    lines.push(`import { Type } from 'class-transformer';`);
    lines.push('');
    lines.push(`export class ${structName}Dto {`);

    properties.forEach(prop => {
      const propName = prop.getName();
      const propType = prop.getType().getText();

      const decorators = getDecoratorsForType(propType);

      decorators.forEach(decorator => {
        lines.push(`  ${decorator}`);
      });
      lines.push(`  ${propName}: ${propType};`);
      lines.push('');
    });

    lines.push('}');

    const filePath = path.join(options.dtoOutputPath, `${structName}Dto.ts`);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log(`✅ Generated DTO: ${filePath}`);
  });
}

function getDecoratorsForType(type: string): string[] {
  const decorators: string[] = [];

  // Si es union
  if (type.includes('|')) {
    const unionTypes = type.split('|').map(t => t.trim());
    for (const t of unionTypes) {
      const validateIf = `@ValidateIf((_, value) => typeof value === '${getJsTypeOf(t)}')`;
      const baseDecorator = getDecoratorsForType(t)[0]; // solo el decorador principal
      decorators.push(validateIf);
      decorators.push(baseDecorator);
    }
    return decorators;
  }

  // Tipos simples
  if (type === 'string') {
    decorators.push('@IsString()');
  } else if (type === 'number' || type === 'bigint') {
    decorators.push('@IsNumber()');
  } else if (type === 'boolean') {
    decorators.push('@IsBoolean()');
  } else if (type.endsWith('[]')) {
    const baseType = type.replace('[]', '').trim();
    decorators.push('@IsArray()');
    const baseDecorators = getDecoratorsForType(baseType);
    baseDecorators.forEach(d =>
      decorators.push(d.replace('()', '({ each: true })'))
    );
  } else {
    // Struct anidada (otra interface)
    decorators.push('@ValidateNested()');
    decorators.push(`@Type(() => ${type}Dto)`);
  }

  return decorators;
}

function getJsTypeOf(type: string): string {
  // Mapea type TS a typeof JS
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'bigint') return 'bigint';
  if (type === 'boolean') return 'boolean';
  if (type.endsWith('[]')) return 'object'; // arrays son "object" en typeof
  return 'object'; // fallback → struct
}