import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ShopOwnerRoute = ({ children }) => {
  const { isAuthenticated, isShopOwner, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isShopOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ShopOwnerRoute; 