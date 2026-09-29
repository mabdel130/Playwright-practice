
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
