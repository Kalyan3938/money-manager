import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string, otp: string) => Promise<boolean>;
  register: (name: string, mobile: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const BASE_URL = "http://localhost:5000/api/v1/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // const savedUser = localStorage.getItem('user');
    // if (savedUser) {
    //   setUser(JSON.parse(savedUser));
    // }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return errorData.message || response.statusText;
        }
        const data = await response.json();
        const { user } = data;
        setUser(user);
        return true;
      }
      catch(error) {
        console.log(error);
        return false;
      }    
    };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Registration Failed', errorData.message || response.statusText)
          return errorData.message || response.statusText;
        }
        return true;
      }
      catch(error) {
        console.log(error);
        return false;
      }    
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
