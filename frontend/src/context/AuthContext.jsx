import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('genops_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem('genops_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('genops_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('genops_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('genops_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('genops_user');
    }
    setLoading(false);
  }, [user]);

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:8081/api/auth/login', { username, password });
    const { token, ...userData } = response.data;
    setToken(token);
    setUser(userData);
    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await axios.post('http://localhost:8081/api/auth/signup', { username, email, password });
    const { token, ...userData } = response.data;
    setToken(token);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('genops_chats'); // Optional: clear local chats on logout
    localStorage.removeItem('genops_active_chat_id');
  };

  const setAuthData = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setAuthData, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
