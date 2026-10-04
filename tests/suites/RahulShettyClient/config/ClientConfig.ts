import * as path from 'path';
import { BaseEnvConfig, loadEnvConfig } from '../../../core/config/EnvConfig';

export interface ClientEnvConfig extends BaseEnvConfig {
  apiBaseUrl: string;
}

export const SUITE_DIR = path.resolve(__dirname, '..');
export const clientConfig = loadEnvConfig<ClientEnvConfig>(SUITE_DIR);
