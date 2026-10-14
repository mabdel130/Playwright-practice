import { BasePage } from '../../../core/BasePage';
import { createSuiteConfig } from '../../../core/config/EnvConfig';

export const { suiteDir: SAUCE_SUITE_DIR, config: { baseUrl } } = createSuiteConfig(__dirname);

export abstract class SauceDemoBasePage extends BasePage {
  protected readonly baseUrl = baseUrl;
}
