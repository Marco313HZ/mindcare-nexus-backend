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
      try {
        // Load stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            id: userData.id,
            full_name: userData.full_name || '',
            email: userData.email || '',
            role: userData.role,
            is_active: userData.is_active
          });
        }
      } catch (error) {
        console.error('Error loading stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
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

      // Store all relevant data in localStorage
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        role: data.user.role,
        is_active: data.user.is_active,
        // Add any other relevant user data you want to store
      }));
      setUser(data.user);

      // Then check if the user is verified
      if (!data.user.is_active) {
        return { verified: false, user: data.user };
      }

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
    localStorage.removeItem('user');
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
