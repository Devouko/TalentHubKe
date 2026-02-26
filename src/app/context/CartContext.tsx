'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartItem, PaymentMethod } from '../types/cart.types';
import { toast } from 'sonner';

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
    if (!session?.user?.id) {
      setCart([])
      return
    }
    
    try {
      const response = await fetch('/api/cart', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        console.error('Cart fetch failed:', response.status)
        setCart([])
        return
      }
      
      const data = await response.json()
      console.log('Cart data received:', data)
      
      if (Array.isArray(data.cart) && data.cart.length > 0) {
        const mappedCart = data.cart.map((item: any) => ({
          id: item.productId || item.id,
          gigId: item.productId || item.id,
          title: item.product?.title || item.title || 'Product',
          seller: 'Digital Store',
          price: item.product?.price || item.price || 0,
          quantity: item.quantity || 1,
          deliveryTime: 0,
          thumbnail: item.product?.images?.[0] || item.thumbnail || '',
          tier: 'basic' as const,
          category: item.product?.category || item.category || 'Digital Products'
        }))
        console.log('Mapped cart:', mappedCart)
        setCart(mappedCart)
      } else {
        console.log('Empty cart or invalid format')
        setCart([])
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
      setCart([])
    }
  }

  useEffect(() => {
    refreshCart();
  }, [session]);

  const addToCart = async (item: CartItem) => {
    if (!session?.user?.id) {
      toast.error('Please sign in to add items to cart')
      setTimeout(() => router.push('/auth'), 1500)
      throw new Error('Not authenticated')
    }
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity || 1
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }
      
      if (data.success) {
        toast.success('Added to cart!')
        return data
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      if (!errorMessage.includes('authenticated')) {
        toast.error(errorMessage)
      }
      throw error
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
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
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
    if (!session?.user?.id) return
    
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to clear cart')
      }
      
      setCart([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const goToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
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
