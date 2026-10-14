import { APIResponse, Page, test } from '@playwright/test';
import { ILogger } from './Logger';

/**
 * Opt-in debugging (DEBUG_API=1): prints and attaches API responses and localStorage.
 * Off by default so tokens never end up in CI logs or report artifacts.
 */
export const DEBUG_API = process.env.DEBUG_API === '1';

function attach(name: string, body: string, contentType: string): void {
  try {
    void test.info().attach(name, { body, contentType });
  } catch {
    // Not running inside a test - console output is enough.
  }
}

export async function recordApiResponse(logger: ILogger, method: string, url: string, response: APIResponse): Promise<void> {
  if (!DEBUG_API) return;
  const text = await response.text();
  let pretty = text;
  try {
    pretty = JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    // Not JSON - keep the raw text.
  }
  const summary = `${method} ${url} -> ${response.status()} ${response.statusText()}`;
  logger.info(summary);
  console.log(`\n🌐 ${summary}\n${pretty}\n`);
  attach(`api-response ${method} ${new URL(url).pathname}`, pretty, 'application/json');
}

export async function recordLocalStorage(page: Page, logger: ILogger, label: string): Promise<void> {
  if (!DEBUG_API || !page.url().startsWith('http')) return;
  const data = await page.evaluate(() => ({ ...(globalThis as unknown as { localStorage: Record<string, string> }).localStorage }));
  const pretty = JSON.stringify(data, null, 2);
  logger.info(`localStorage after ${label}: ${Object.keys(data).join(', ') || '(empty)'}`);
  console.log(`\n💾 localStorage after ${label} (${page.url()})\n${pretty}\n`);
  attach(`localStorage ${label}`, pretty, 'application/json');
}
