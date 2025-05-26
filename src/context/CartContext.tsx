import React, {createContext, useState, ReactNode} from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  removeItemTotalFromCart: (productId: string) => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => { },
  removeItemTotalFromCart:()=>{},
  getItemQuantity: () => 0,
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  clearCart: () => {},
});

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);

      if (existingItem) {
        // If item exists, increase quantity
        return prev.map(item =>
          item.product.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      } else {
        // If item doesn't exist, add new item with quantity 1
        return [...prev, {product, quantity: 1}];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // If quantity > 1, decrease quantity
        return prev.map(item =>
          item.product.id === productId
            ? {...item, quantity: item.quantity - 1}
            : item,
        );
      } else {
        // If quantity is 1, remove item completely
        return prev.filter(item => item.product.id !== productId);
      }
    });
  };
  const removeItemTotalFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };  
  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
        removeItemTotalFromCart
      }}>
      {children}
    </CartContext.Provider>
  );
};
