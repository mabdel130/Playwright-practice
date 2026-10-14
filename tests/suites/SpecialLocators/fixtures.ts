import * as path from 'path';
import { test as base, expect } from '../../core/fixtures';
import { loadData } from '../../core/data/DataLoader';
import { AngularPracticePage, PracticeFormData } from './pages/AngularPracticePage';

export interface SpecialLocatorsData {
  url: string;
  form: PracticeFormData;
  products: string[];
}

export const practiceData = loadData<SpecialLocatorsData>(path.resolve(__dirname), 'form.data.json');

export const test = base.extend<{ practicePage: AngularPracticePage }>({
  practicePage: async ({ page, logger }, use) => use(new AngularPracticePage(page, logger, practiceData.url)),
});

export { expect };
