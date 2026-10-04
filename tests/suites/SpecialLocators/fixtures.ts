import * as fs from 'fs';
import * as path from 'path';
import { test as base, expect } from '../../core/fixtures';
import { AngularPracticePage, PracticeFormData } from './pages/AngularPracticePage';

export interface SpecialLocatorsData {
  url: string;
  form: PracticeFormData;
  products: string[];
}

export const practiceData: SpecialLocatorsData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'form.data.json'), 'utf-8'),
);

export const test = base.extend<{ practicePage: AngularPracticePage }>({
  practicePage: async ({ page, logger }, use) => use(new AngularPracticePage(page, logger, practiceData.url)),
});

export { expect };
