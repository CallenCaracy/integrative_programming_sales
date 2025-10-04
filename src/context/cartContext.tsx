"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  sellerId: string ;
  images: { url: string; public_id: string }[];
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
    setLoaded(true); 
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

const addItem = (newItem: CartItem) => {
  setCart(prev => {
    const existing = prev.items.find(i => i.itemId === newItem.itemId);
    let updatedItems;

    if (existing) {
      updatedItems = prev.items.map(i =>
        i.itemId === newItem.itemId ? { ...i, quantity: i.quantity + newItem.quantity } : i
      );
    } else {
      updatedItems = [...prev.items, newItem];
    }

    const newTotal = updatedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    return { items: updatedItems, totalPrice: newTotal };
  });
};

  const removeItem = (itemId: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(i => i.itemId !== itemId);
      const newTotal = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      return { items: updatedItems, totalPrice: newTotal };
    });
  };

  const clearCart = () => setCart({ items: [], totalPrice: 0 });

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
