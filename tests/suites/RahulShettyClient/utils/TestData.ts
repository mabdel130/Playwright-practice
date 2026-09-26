import { faker } from '../../../core/TestDataFactory';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  gender: 'Male' | 'Female';
  password: string;
}

export interface CheckoutData {
  cardNumber: string;
  expiryMonth: string;
  expiryDay: string;
  cvv: string;
  nameOnCard: string;
  country: string;
}

const OCCUPATIONS = ['1: Doctor', '2: Student', '3: Engineer', '4: Scientist'] as const;

const COUNTRIES = [
  'India',
  'United Kingdom',
  'United States',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Egypt',
  'Brazil',
  'Japan',
  'Spain',
  'Italy',
  'Netherlands',
] as const;

export const PRODUCT_NAME = 'ZARA COAT 3';

function twoDigits(n: number): string {
  return n.toString().padStart(2, '0');
}

export function createUser(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const gender = faker.helpers.arrayElement<'Male' | 'Female'>(['Male', 'Female']);

  const uniqueSuffix = `${Date.now()}${faker.string.alphanumeric(4)}`;

  return {
    firstName,
    lastName,
    email: faker.internet
      .email({ firstName, lastName, provider: 'test.com' })
      .toLowerCase()
      .replace('@', `.${uniqueSuffix}@`),
    phone: faker.string.numeric(10),
    occupation: faker.helpers.arrayElement(OCCUPATIONS),
    gender,
    password: `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric(2)}@`,
  };
}

export function createCheckoutData(user: UserData): CheckoutData {
  return {
    cardNumber: faker.finance.creditCardNumber('4###-####-####-####').replace(/-/g, ' '),
    expiryMonth: twoDigits(faker.number.int({ min: 1, max: 12 })),
    expiryDay: twoDigits(faker.number.int({ min: 1, max: 31 })),
    cvv: faker.finance.creditCardCVV(),
    nameOnCard: `${user.firstName} ${user.lastName}`,
    country: faker.helpers.arrayElement(COUNTRIES),
  };
}
