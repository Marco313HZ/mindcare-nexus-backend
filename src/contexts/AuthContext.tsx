
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ verified: boolean; user: any }>;
  logout: () => void;
  signup: (userData: any, userType: string) => Promise<void>;
  verifyEmail: (email: string, code: string, userType: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Decode token to get user info (in a real app, you'd validate with backend)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          full_name: payload.full_name,
          email: payload.email,
          role: payload.role,
          is_active: payload.is_active
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // First set the user data and token
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);

      // Then check if the user is verified
      if (!data.user.is_active) {
        // Don't throw error if user is not active, just return the data
        // This allows the component to handle routing appropriately
        return { verified: false, user: data.user };
      }

      // If user is verified, return success
      return { verified: true, user: data.user };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any, userType: string) => {
  setIsLoading(true);
  try {
    // Keep original userType for URL, but use SuperAdmin in payload when userType is admin
    const normalizedUserData = {
      ...userData,
      userType: userType.toLowerCase() === 'admin' ? 'SuperAdmin' : userType
    };

    const response = await fetch(`http://localhost:3000/api/auth/signup/${userType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(normalizedUserData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string, userType: string) => {
  setIsLoading(true);
  try {
    // Map 'admin' to 'SuperAdmin' for verification
    const normalizedUserType = userType.toLowerCase() === 'admin' ? 'SuperAdmin'
      : userType.toLowerCase() === 'doctor' ? 'Doctor'
      : userType.toLowerCase() === 'patient' ? 'Patient'
      : userType;

    const response = await fetch('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ email, code, userType: normalizedUserType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      signup,
      verifyEmail,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
