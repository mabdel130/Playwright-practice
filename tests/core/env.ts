export type EnvName = 'dev' | 'test' | 'staging' | 'prod';

const validEnvs: EnvName[] = ['dev', 'test', 'staging', 'prod'];
const envValue = (process.env.TEST_ENV ?? 'test') as string;

if (!validEnvs.includes(envValue as EnvName)) {
  throw new Error(
    `Invalid TEST_ENV: "${envValue}". Must be one of: ${validEnvs.join(' | ')}`
  );
}

export const ENV: EnvName = envValue as EnvName;
