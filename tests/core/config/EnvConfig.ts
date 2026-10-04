import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../env';

export interface BaseEnvConfig {
  baseUrl: string;
}

export function loadEnvConfig<T extends BaseEnvConfig = BaseEnvConfig>(suiteDir: string): T {
  const configPath = path.join(suiteDir, 'config', 'env.config.json');
  const allEnvs = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const config = allEnvs[ENV];
  if (!config) {
    throw new Error(`No "${ENV}" entry in ${configPath}`);
  }
  return config as T;
}
