export { faker } from '@faker-js/faker';

export function createFactory<T>(builder: () => T): T {
  return builder();
}
