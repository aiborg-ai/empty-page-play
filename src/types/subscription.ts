export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isSubscribed?: boolean;
  icon: string;
  badge?: string;
}

export type ProductCategory = 'agents' | 'tools' | 'datasets' | 'reports' | 'apis';

export interface Subscription {
  id: string;
  productId: string;
  userId: string;
  status: 'active' | 'cancelled' | 'pending';
  startDate: Date;
  endDate?: Date;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Invoice {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
}