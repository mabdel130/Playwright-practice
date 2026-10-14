import { BasePage } from '../../../core/BasePage';
import { createSuiteConfig } from '../../../core/config/EnvConfig';

export const { suiteDir: ALERTS_SUITE_DIR, config: { baseUrl } } = createSuiteConfig(__dirname);

export abstract class TestAutomationPracticeBasePage extends BasePage {
  protected readonly baseUrl = baseUrl;
}
