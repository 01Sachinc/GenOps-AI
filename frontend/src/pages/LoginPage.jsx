import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiGithub, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8081/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-primary to-accent-secondary shadow-xl shadow-indigo-500/20 mb-4">
            <span className="text-3xl text-white">G</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GenOps AI</h1>
          <p className="text-gray-400 mt-2">Sign in to your enterprise AI platform</p>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold hover:opacity-90 transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              {!isLoading && <FiArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="my-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center space-x-2 py-3 border border-white/5 bg-dark-900/50 rounded-xl hover:bg-dark-700/50 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-300">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center space-x-2 py-3 border border-white/5 bg-dark-900/50 rounded-xl hover:bg-dark-700/50 transition-colors"
            >
              <FiGithub className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-gray-300">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account? {' '}
          <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
