import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { ENV } from '../env';

function readEnvFile(filePath: string): Record<string, string> {
  return fs.existsSync(filePath) ? dotenv.parse(fs.readFileSync(filePath)) : {};
}

/**
 * Secrets for one suite, read from that suite's own folder.
 * Priority: real environment (CI secrets) > <suite>/.env.<TEST_ENV> > <suite>/.env
 */
export function loadSuiteEnv(suiteDir: string): Record<string, string | undefined> {
  return {
    ...readEnvFile(path.join(suiteDir, '.env')),
    ...readEnvFile(path.join(suiteDir, `.env.${ENV}`)),
    ...process.env,
  };
}

/**
 * Loads <suite>/data/<TEST_ENV>/<fileName> and fills its placeholders:
 *   ${VAR_NAME}   -> value of VAR_NAME from the suite's .env (keeps emails/passwords out of git)
 *   {{timestamp}} -> current time in ms (also works inside .env values)
 */
export function loadData<T>(suiteDir: string, fileName: string): T {
  const filePath = path.join(suiteDir, 'data', ENV, fileName);
  const vars = loadSuiteEnv(suiteDir);
  const raw = fs
    .readFileSync(filePath, 'utf-8')
    .replace(/\$\{([A-Z0-9_]+)\}/g, (_, name: string) => {
      const value = vars[name];
      if (value === undefined) {
        throw new Error(
          `Missing "${name}" used in ${filePath}. ` +
          `Add it to ${path.join(suiteDir, '.env')} (see .env.example there) or set it as a CI secret.`
        );
      }
      // JSON-escape so quotes or backslashes in a secret cannot break the file.
      return JSON.stringify(value).slice(1, -1);
    })
    .replace(/\{\{timestamp\}\}/g, Date.now().toString());
  return JSON.parse(raw) as T;
}
