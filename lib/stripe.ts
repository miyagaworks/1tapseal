import Stripe from 'stripe';

// Server-side Stripe client - lazy initialization
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return _stripe;
}

// Backward compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// 価格計算関数
export function calculatePrice(quantity: number) {
  let unitPrice = 550;
  if (quantity >= 10 && quantity < 50) {
    unitPrice = 528;
  } else if (quantity >= 50 && quantity < 100) {
    unitPrice = 462;
  }
  const subtotal = unitPrice * quantity;
  const shipping = 220;
  return {
    unitPrice,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}
