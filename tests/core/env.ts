export type EnvName = 'dev' | 'test' | 'staging' | 'prod';

export const VALID_ENVS: readonly EnvName[] = ['dev', 'test', 'staging', 'prod'];

export function parseEnv(value: string | undefined): EnvName {
  const envValue = value ?? 'test';
  if (!VALID_ENVS.includes(envValue as EnvName)) {
    throw new Error(
      `Invalid TEST_ENV: "${envValue}". Must be one of: ${VALID_ENVS.join(' | ')}`
    );
  }
  return envValue as EnvName;
}

export const ENV: EnvName = parseEnv(process.env.TEST_ENV);
