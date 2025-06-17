import { SourceFile, Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

interface GenerateSingleDtoOptions {
  interfaceName: string;
  sourceFile: SourceFile;
  outputPath: string;
}

export function generateDtoFromInterface(options: GenerateSingleDtoOptions) {
  const iface = options.sourceFile.getInterface(options.interfaceName);

  if (!iface) {
    console.error(`❌ Interface "${options.interfaceName}" not found.`);
    return;
  }

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

  const outputDir = path.dirname(options.outputPath);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(options.outputPath, lines.join('\n'), 'utf-8');
  console.log(`✅ DTO for "${structName}" generated at: ${options.outputPath}`);
}

function getDecoratorsForType(type: string): string[] {
  const decorators: string[] = [];

  if (type.includes('|')) {
    const unionTypes = type.split('|').map(t => t.trim());
    for (const t of unionTypes) {
      const validateIf = `@ValidateIf((_, value) => typeof value === '${getJsTypeOf(t)}')`;
      const baseDecorator = getDecoratorsForType(t)[0];
      decorators.push(validateIf);
      decorators.push(baseDecorator);
    }
    return decorators;
  }

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
    decorators.push('@ValidateNested()');
    decorators.push(`@Type(() => ${type}Dto)`);
  }

  return decorators;
}

function getJsTypeOf(type: string): string {
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'bigint') return 'bigint';
  if (type === 'boolean') return 'boolean';
  if (type.endsWith('[]')) return 'object';
  return 'object';
}