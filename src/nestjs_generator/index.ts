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
  port: string;
  contractId: string;
  contractIdl: string;
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
    contractId,
    contractIdl
  } = data;

  console.log('⚙️ Working in server ...');

  // clone the base repository for the nestjs server
  const nestJsSrcDir = path.join(nestjsPath, 'src');
  const emitter = degit(GITHUB_BASE_NESTJS, { cache: false, force: true });
  await emitter.clone(outPath);

  fs.moveSync(
    contractClientPath,
    path.join(nestJsSrcDir, CONTRACT_CLIENT_OUT_DIR),
  );

  const servicesNames = idlProgram.serviceNames().filter(serviceName => serviceName != 'KeyringService');

  for (const serviceName of servicesNames) {
    moduleGenerator(
      serviceName,
      nestJsSrcDir,
      idlProgram
    )
  }
  console.log('Nestjs Modules created ✅');
  
  createMainModule(nestJsSrcDir, servicesNames);

  console.log('NestJs Main module created ✅');

  createEnvFile({
    nestJsPath: nestjsPath,
    rpcUrl,
    nodeEnv,
    port,
    contractId,
    contractIdl
  });

  console.log('Env file created ✅');
}