// src/contexts/AuthContext.tsx
"use client";

import type { User } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_KEY = 'hydrocontrol_mock_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage (mock persistence)
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: '1', email, name: email.split('@')[0] };
    setUser(mockUser);
    try {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    try {
      localStorage.removeItem(MOCK_USER_KEY);
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
    setLoading(false);
  };

  const register = async (email: string, _: string, name?: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: Date.now().toString(), email, name: name || email.split('@')[0] };
    setUser(mockUser);
     try {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
