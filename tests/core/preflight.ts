import * as fs from 'fs';
import * as path from 'path';
import { VALID_ENVS, EnvName } from './env';

export interface PreflightIssue {
  suite: string;
  message: string;
}

const REFERENCE_ENV: EnvName = 'test';

function listJson(dir: string): string[] {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
}

/**
 * Pure static checks of one suite folder: env config entry for the active env,
 * and the same data file set in every data/<env>/ folder as in data/test/.
 */
export function checkSuite(suitesDir: string, suite: string, env: EnvName): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  const suiteDir = path.join(suitesDir, suite);
  const configPath = path.join(suiteDir, 'config', 'env.config.json');

  if (fs.existsSync(configPath)) {
    try {
      const all = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (!all[env]) {
        issues.push({ suite, message: `no "${env}" entry in config/env.config.json` });
      } else if (!all[env].baseUrl) {
        issues.push({ suite, message: `"${env}" entry has no baseUrl` });
      }
    } catch (e) {
      issues.push({ suite, message: `config/env.config.json is not valid JSON: ${(e as Error).message}` });
    }
  }

  const dataDir = path.join(suiteDir, 'data');
  const reference = listJson(path.join(dataDir, REFERENCE_ENV));
  if (reference.length > 0) {
    for (const e of VALID_ENVS) {
      const files = listJson(path.join(dataDir, e));
      const missing = reference.filter((f) => !files.includes(f));
      if (missing.length > 0) {
        issues.push({ suite, message: `data/${e}/ is missing: ${missing.join(', ')}` });
      }
      for (const f of files) {
        try {
          JSON.parse(fs.readFileSync(path.join(dataDir, e, f), 'utf-8').replace(/\{\{timestamp\}\}/g, '0'));
        } catch (err) {
          issues.push({ suite, message: `data/${e}/${f} is not valid JSON: ${(err as Error).message}` });
        }
      }
    }
  }
  return issues;
}

export function checkAllSuites(suitesDir: string, env: EnvName): PreflightIssue[] {
  if (!fs.existsSync(suitesDir)) return [];
  return fs
    .readdirSync(suitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => checkSuite(suitesDir, d.name, env));
}

export async function checkBaseUrls(suitesDir: string, env: EnvName): Promise<PreflightIssue[]> {
  const issues: PreflightIssue[] = [];
  if (!fs.existsSync(suitesDir)) return issues;
  for (const suite of fs.readdirSync(suitesDir)) {
    const configPath = path.join(suitesDir, suite, 'config', 'env.config.json');
    if (!fs.existsSync(configPath)) continue;
    const baseUrl = JSON.parse(fs.readFileSync(configPath, 'utf-8'))[env]?.baseUrl;
    if (!baseUrl) continue;
    try {
      await fetch(baseUrl, { method: 'HEAD', signal: AbortSignal.timeout(10_000) });
    } catch (e) {
      issues.push({ suite, message: `base URL ${baseUrl} is not reachable: ${(e as Error).message}` });
    }
  }
  return issues;
}
