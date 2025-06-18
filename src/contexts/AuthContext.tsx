
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  profile_picture?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ verified: boolean; user: any }>;
  logout: () => void;
  signup: (userData: any, userType: string) => Promise<void>;
  verifyEmail: (email: string, code: string, userType: string) => Promise<void>;
  isLoading: boolean;
  fetchUserProfile: () => Promise<void>;
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
            is_active: userData.is_active,
            profile_picture: userData.profile_picture || '',
            phone: userData.phone || ''
          });
          
          // Fetch complete profile data
          fetchUserProfile();
        }
      } catch (error) {
        console.error('Error loading stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const fetchUserProfile = async () => {
    const storedUserId = localStorage.getItem('user_id');
    const storedRole = localStorage.getItem('role');
    
    if (!storedUserId || !storedRole || !token) return;

    try {
      let endpoint = '';
      
      switch (storedRole) {
        case 'SuperAdmin':
          endpoint = `/api/super-admins/${storedUserId}`;
          break;
        case 'Doctor':
          endpoint = `/api/doctors/${storedUserId}`;
          break;
        case 'Patient':
          endpoint = `/api/patients/${storedUserId}`;
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        const completeUserData = {
          id: profileData.id || profileData.super_admin_id || profileData.doctor_id || profileData.patient_id,
          full_name: profileData.full_name || '',
          email: profileData.email || '',
          role: storedRole,
          is_active: profileData.is_active !== undefined ? profileData.is_active : true,
          profile_picture: profileData.profile_picture || '',
          phone: profileData.phone || ''
        };

        setUser(completeUserData);
        localStorage.setItem('user', JSON.stringify(completeUserData));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

      console.log('Login response data:', data);

      // Store token and user data with all available information
      setToken(data.token);
      localStorage.setItem('token', data.token);
      
      // Store user ID and role separately for API calls
      localStorage.setItem('user_id', data.user.id.toString());
      localStorage.setItem('role', data.user.role);
      
      // Make sure we capture all user data from the response
      const completeUserData = {
        id: data.user.id,
        full_name: data.user.full_name || data.full_name || '',
        email: data.user.email || data.email || email,
        role: data.user.role || data.role,
        is_active: data.is_active !== undefined ? data.is_active : true,
        profile_picture: data.user.profile_picture || data.profile_picture || '',
        phone: data.user.phone || data.phone || ''
      };

      localStorage.setItem('user', JSON.stringify(completeUserData));
      
      // Set user state with complete data
      setUser(completeUserData);

      console.log('Complete user data stored:', completeUserData);

      // Fetch additional profile data
      setTimeout(() => {
        fetchUserProfile();
      }, 100);

      // Check if the user is verified
      if (!data.is_active) {
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

      const response = await fetch(`${API_BASE_URL}/api/auth/signup/${userType}`, {
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

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      signup,
      verifyEmail,
      isLoading,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
