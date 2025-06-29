import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const queryClient = useQueryClient();

  // Fetch user data if token exists
  const { data: user, isLoading, error } = useQuery(
    ['user', token],
    () => api.get('/auth/me').then(res => res.data.user),
    {
      enabled: !!token,
      retry: false,
      onError: () => {
        logout();
      }
    }
  );

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      queryClient.setQueryData(['user', newToken], userData);
      toast.success('Login successful!');
      
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: userInfo } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      queryClient.setQueryData(['user', newToken], userInfo);
      toast.success('Registration successful!');
      
      return userInfo;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data.user;
      
      queryClient.setQueryData(['user', token], updatedUser);
      toast.success('Profile updated successfully!');
      
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      throw error;
    }
  };

  // Set up API headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    isShopOwner: user?.role === 'shop_owner',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 