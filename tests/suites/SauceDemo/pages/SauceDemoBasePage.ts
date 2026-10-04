import * as path from 'path';
import { BasePage } from '../../../core/BasePage';
import { loadEnvConfig } from '../../../core/config/EnvConfig';

export const SAUCE_SUITE_DIR = path.resolve(__dirname, '..');
const { baseUrl } = loadEnvConfig(SAUCE_SUITE_DIR);

export abstract class SauceDemoBasePage extends BasePage {
  protected readonly baseUrl = baseUrl;
}
