'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartItem, PaymentMethod } from '../types/cart.types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  fees: number;
  total: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  refreshCart: () => Promise<void>;
  goToCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const refreshCart = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/products?action=cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.items.map((item: any) => ({
          id: item.productId,
          gigId: item.productId,
          title: item.title,
          seller: 'Digital Store',
          price: item.price,
          quantity: item.quantity,
          deliveryTime: 0,
          thumbnail: item.images[0] || '',
          tier: 'basic' as const
        })));
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [session]);

  const addToCart = async (item: CartItem) => {
    if (!session?.user?.id) {
      router.push('/auth');
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addToCart',
          productId: item.id,
          quantity: 1
        })
      });
      
      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/products?action=removeFromCart&productId=${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateCart',
          productId,
          quantity
        })
      });
      
      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const clearCart = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/products?action=removeFromCart', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const fees = 0; // No fees for digital products
  const total = subtotal + fees;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      fees,
      total,
      paymentMethod,
      setPaymentMethod,
      refreshCart,
      goToCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
