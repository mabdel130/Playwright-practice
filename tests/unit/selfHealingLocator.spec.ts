import { test, expect, Locator } from '@playwright/test';
import { SelfHealingLocator, HEALED_ANNOTATION } from '../core/SelfHealingLocator';
import { Logger } from '../core/Logger';

function fakeLocator(visible: boolean) {
  const calls = { click: 0, fill: [] as string[] };
  const locator = {
    waitFor: async () => {
      if (!visible) throw new Error('not visible');
    },
    click: async () => { calls.click++; },
    fill: async (v: string) => { calls.fill.push(v); },
    toString: () => (visible ? 'visible-locator' : 'hidden-locator'),
  } as unknown as Locator;
  return { locator, calls };
}

test.describe('SelfHealingLocator', () => {
  test('returns the primary locator when visible, without annotation', async () => {
    const primary = fakeLocator(true);
    const backup = fakeLocator(true);
    const healer = new SelfHealingLocator(new Logger());
    expect(await healer.findElement(primary.locator, [backup.locator])).toBe(primary.locator);
    expect(test.info().annotations.some((a) => a.type === HEALED_ANNOTATION)).toBe(false);
  });

  test('falls back to the first visible backup and records a healed annotation', async () => {
    const primary = fakeLocator(false);
    const hidden = fakeLocator(false);
    const backup = fakeLocator(true);
    const logger = new Logger();
    const result = await new SelfHealingLocator(logger).findElement(primary.locator, [hidden.locator, backup.locator]);
    expect(result).toBe(backup.locator);
    expect(logger.getText()).toContain('Backup locator found element');
    const heal = test.info().annotations.find((a) => a.type === HEALED_ANNOTATION);
    expect(heal?.description).toContain('backup#1');
  });

  test('throws when every strategy fails', async () => {
    const healer = new SelfHealingLocator(new Logger());
    await expect(healer.findElement(fakeLocator(false).locator, [fakeLocator(false).locator]))
      .rejects.toThrow('All locator strategies failed');
  });

  test('clickWithHealing and fillWithHealing act on the healed locator', async () => {
    const primary = fakeLocator(false);
    const backup = fakeLocator(true);
    const healer = new SelfHealingLocator(new Logger());
    await healer.clickWithHealing(primary.locator, [backup.locator]);
    await healer.fillWithHealing('abc', primary.locator, [backup.locator]);
    expect(backup.calls.click).toBe(1);
    expect(backup.calls.fill).toEqual(['abc']);
  });
});
