import { BasePage } from '../../../core/BasePage';
import { createSuiteConfig } from '../../../core/config/EnvConfig';

export const { suiteDir: SPECIAL_SUITE_DIR, config: { baseUrl } } = createSuiteConfig(__dirname);

export abstract class SpecialLocatorsBasePage extends BasePage {
  protected readonly baseUrl = baseUrl;
}
