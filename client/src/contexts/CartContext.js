import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedCart = prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedCart;
      } else {
        // Add new item to cart
        const newCart = [...prevCart, { product, quantity }];
        toast.success(`${product.name} added to cart`);
        return newCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.product._id === productId);
      const newCart = prevCart.filter(item => item.product._id !== productId);
      
      if (item) {
        toast.success(`${item.product.name} removed from cart`);
      }
      
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      );
      
      const item = updatedCart.find(item => item.product._id === productId);
      if (item) {
        toast.success(`Updated ${item.product.name} quantity`);
      }
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItems = () => {
    return cart;
  };

  const isInCart = (productId) => {
    return cart.some(item => item.product._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  const value = {
    cart,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItems,
    isInCart,
    getItemQuantity,
    openCart,
    closeCart,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 