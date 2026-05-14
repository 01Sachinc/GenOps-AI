import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // For OAuth2, we might not have all user data yet, 
      // but the token is valid for authentication.
      // In a real app, you might fetch user profile here.
      setAuthData(token, { username: 'Social User', email: 'oauth2' });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium">Completing social login...</p>
      </div>
    </div>
  );
};
