import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

// Base URL for API calls
const API_BASE_URL = 'https://tajbookingservices.onrender.com';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (!authState.token) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setAuthState({
          user: res.data,
          token: authState.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed',
        });
      }
    };

    loadUser();
  }, [authState.token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      
      setAuthState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        error: err.response?.data?.message || 'Login failed',
      }));
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        user: authState.user,
        login,
        logout,
        error: authState.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};