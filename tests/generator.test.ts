import { generateNestProject } from '../src/generator';
import { ParsedIDL } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';

describe('generateNestProject', () => {
  const outputDir = path.join(__dirname, 'tmp-test-output');

  const mockParsedIDL: ParsedIDL = {
    services: [
      { name: 'TestService', methods: [{ name: 'sayHello', params: [] }] },
    ],
  };

  afterAll(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  it('generates a NestJS project structure', async () => {
    await generateNestProject(mockParsedIDL, outputDir);

    expect(fs.existsSync(path.join(outputDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'src/main.ts'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'src/app.module.ts'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'src/services/TestService.service.ts'))).toBe(true);
  });
});