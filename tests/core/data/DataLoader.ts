import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../env';

export function loadData<T>(suiteDir: string, fileName: string): T {
  const filePath = path.join(suiteDir, 'data', ENV, fileName);
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/\{\{timestamp\}\}/g, Date.now().toString());
  return JSON.parse(raw) as T;
}
