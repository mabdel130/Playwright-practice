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

export interface Credentials {
  email: string;
  password: string;
}

export type UsersData = Record<string, Credentials>;

export interface LoginCase {
  id: string;
  title: string;
  technique: string;
  userRef?: string;
  email?: string;
  password?: string;
  expected: {
    type: 'success' | 'error';
    status: number;
    message: string;
  };
}

export interface CartData {
  validProduct: string;
  invalidProduct: string;
}

export interface E2EData {
  user: UserData;
  product: string;
  checkout: CheckoutData;
}

export interface ProductRef {
  name: string;
  id: string;
}

export interface OrderFlowData {
  products: ProductRef[];
  checkout: CheckoutData;
}

export function resolveCredentials(users: UsersData, source: { userRef?: string; email?: string; password?: string }): Credentials {
  const base = source.userRef ? users[source.userRef] : undefined;
  if (source.userRef && !base) {
    throw new Error(`Unknown userRef "${source.userRef}" in users.data.json`);
  }
  return {
    email: source.email ?? base?.email ?? '',
    password: source.password ?? base?.password ?? '',
  };
}
