"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartProduct {
  productID: number;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  image: string;
}

interface Cart {
  products: CartProduct[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart;
  addProduct: (product: CartProduct) => void;
  removeProduct: (productID: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ products: [], totalPrice: 0 });
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

const addProduct = (newProduct: CartProduct) => {
  setCart(prev => {
    const existing = prev.products.find(i => i.productID == newProduct.productID);
    let updatedProducts;

    if (existing) {
      updatedProducts = prev.products.map(i =>
        i.productID === newProduct.productID ? { ...i, quantity: i.quantity + newProduct.quantity } : i
      );
    } else {
      updatedProducts = [...prev.products, newProduct];
    }

    const newTotal = updatedProducts.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    return { products: updatedProducts, totalPrice: newTotal };
  });
};

  const removeProduct = (productID: number) => {
    setCart(prev => {
      const updatedProducts = prev.products.filter(i => i.productID !== productID);
      const newTotal = updatedProducts.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      return { products: updatedProducts, totalPrice: newTotal };
    });
  };

  const clearCart = () => setCart({ products: [], totalPrice: 0 });

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, clearCart }}>
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
