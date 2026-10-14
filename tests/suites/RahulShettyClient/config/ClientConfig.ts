import { BaseEnvConfig, createSuiteConfig } from '../../../core/config/EnvConfig';

export interface ClientEnvConfig extends BaseEnvConfig {
  apiBaseUrl: string;
}

export const { suiteDir: SUITE_DIR, config: clientConfig } = createSuiteConfig<ClientEnvConfig>(__dirname);
