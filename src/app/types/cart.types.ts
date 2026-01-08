export interface CartItem {
  id: string;
  gigId: string;
  title: string;
  seller: string;
  price: number;
  quantity: number;
  deliveryTime: number;
  thumbnail: string;
  tier: 'basic' | 'standard' | 'premium';
}

export type PaymentMethod = 'card' | 'paypal' | 'crypto' | 'wallet';

export interface PaymentState {
  method: PaymentMethod;
  processing: boolean;
  success: boolean;
}
