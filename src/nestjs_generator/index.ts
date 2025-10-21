import { IdlProgram } from '../IdlProgram';
import { CONTRACT_CLIENT_OUT_DIR } from '../utils';
import { GITHUB_BASE_NESTJS } from '../utils';
import { moduleGenerator } from './module_generator';
import { createMainModule } from './main_module_generator';
import { createEnvFile } from './env_file_gnerator';
import fs from 'fs-extra'
import path from 'path';
import degit from 'degit';

export interface NestJsData {
  idlProgram: IdlProgram;
  nestjsPath: string;
  contractClientPath: string;
  outPath: string;
  rpcUrl: string;
  nodeEnv: string;
  port: number;
  sponsorName: string;
  sponsorMnemonic: string;
  contractId: string;
  contractIdl: string;
  workerWaitingTime: string;
  initialTokensForVoucher: number;
  initialVoucherExpiration: number;
  minTokensForVoucher: number;
  tokensToAddToVOucher: number;
  newVoucherExpiration: number;
}

export async function generateNestProject(data: NestJsData) {
  const {
    idlProgram,
    nestjsPath,
    contractClientPath,
    outPath,
    rpcUrl,
    nodeEnv,
    port,
    sponsorName,
    sponsorMnemonic,
    contractId,
    contractIdl,
    workerWaitingTime,
    initialTokensForVoucher,
    initialVoucherExpiration,
    minTokensForVoucher,
    tokensToAddToVOucher,
    newVoucherExpiration
  } = data;

  console.log('⚙️  Working in server ...');

  // clone the base repository for the nestjs server
  const nestJsSrcDir = path.join(nestjsPath, 'src');
  const emitter = degit(GITHUB_BASE_NESTJS, { cache: false, force: true });
  await emitter.clone(outPath);

  // [TODO]: remove when sails-cli fix typescript bug
  // fs.moveSync(
  //   contractClientPath,
  //   path.join(nestJsSrcDir, CONTRACT_CLIENT_OUT_DIR),
  // );

  const servicesNames = idlProgram.serviceNames().filter(serviceName => serviceName != 'KeyringService');

  const readmePath = path.join(nestjsPath, 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  const nextjsImageIndex = readmeContent.indexOf('<p align="center">');
  let readmeFileContent = readmeContent.substring(0, nextjsImageIndex);
  
  const modulesSubtitleIndex = readmeFileContent.indexOf('### Modules:');
  let readmeFirstPart = readmeFileContent.substring(0, modulesSubtitleIndex-1);
  let readmeSecondPart = readmeFileContent.substring(modulesSubtitleIndex+14);

  let modulesNames: string[] = [];

  for (const serviceName of servicesNames) {
    modulesNames.push(`- ${serviceName}: **Your module description.**`);
  }

  const lines: string[] = [
    readmeFirstPart,
    "### Modules:",
    "",
    ...modulesNames,
    readmeSecondPart
  ];

  lines.push('### Nestjs url');
  lines.push('Following are the available url for nestjs server based on the provided idl:\n');

  for (const serviceName of servicesNames) {
    const moduleUrls = moduleGenerator(
      serviceName,
      nestJsSrcDir,
      idlProgram,
      port
    );

    moduleUrls.forEach(url => {
      const {
        serviceName,
        funcName,
        url: urlStr,
        isQuery
      } = url;

      const functionType = !url.isQuery ? 'command' : 'query';
      lines.push(`- Url for \`${funcName}\` ${functionType} in service \`${serviceName}\`: *${urlStr}*`);
    });

    lines.push("");
  }

  lines.push('\n### Signless calls:');
  lines.push(`1. User register: http://localhost:${port}/auth/register`);
  lines.push('\n    You need to send the next json data to the server with the user info:');
  lines.push('  \`\`\`javascript');
  lines.push('  {');
  lines.push('    "username": "username",');
  lines.push('    "password": "user_password"');
  lines.push('  {');
  lines.push('  \`\`\`');
  lines.push(`2. User login: http://localhost:${port}/auth/login`);
  lines.push('\n    You need to send the next json data to the server with the user info, in this call the server will set cookies with the user account:');
  lines.push('  \`\`\`javascript');
  lines.push('  {');
  lines.push('    "username": "username",');
  lines.push('    "password": "user_password"');
  lines.push('  {');
  lines.push('  \`\`\`');
  lines.push(`3. User session refresh: http://localhost:${port}/auth/refresh`);
  lines.push('\n    This call will refresh the user JWT tokens to still send messages.');
  lines.push('');
  lines.push(`<p align="center">`);
  lines.push(`    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />`);
  lines.push(`</p>`);

  const readmeCode = lines.join('\n');

  console.log('Nestjs Modules created ✅');
  
  createMainModule(nestJsSrcDir, servicesNames);

  console.log('NestJs Main module created ✅');

  createEnvFile({
    nestJsPath: nestjsPath,
    rpcUrl,
    nodeEnv,
    port,
    sponsorName,
    sponsorMnemonic,
    contractId,
    contractIdl,
    workerWaitingTime,
    initialTokensForVoucher,
    initialVoucherExpiration,
    minTokensForVoucher,
    tokensToAddToVOucher,
    newVoucherExpiration
  });

  fs.writeFileSync(readmePath, readmeCode);

  console.log('Env file created ✅');
}

