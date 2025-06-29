import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import ShopDashboard from './pages/shop/Dashboard';
import ShopProducts from './pages/shop/Products';
import ShopOrders from './pages/shop/Orders';
import AddProduct from './pages/shop/AddProduct';
import EditProduct from './pages/shop/EditProduct';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ShopOwnerRoute from './components/auth/ShopOwnerRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          
          {/* Shop Owner Routes */}
          <Route path="/shop" element={
            <ShopOwnerRoute>
              <ShopDashboard />
            </ShopOwnerRoute>
          } />
          <Route path="/shop/products" element={
            <ShopOwnerRoute>
              <ShopProducts />
            </ShopOwnerRoute>
          } />
          <Route path="/shop/products/add" element={
            <ShopOwnerRoute>
              <AddProduct />
            </ShopOwnerRoute>
          } />
          <Route path="/shop/products/edit/:id" element={
            <ShopOwnerRoute>
              <EditProduct />
            </ShopOwnerRoute>
          } />
          <Route path="/shop/orders" element={
            <ShopOwnerRoute>
              <ShopOrders />
            </ShopOwnerRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 