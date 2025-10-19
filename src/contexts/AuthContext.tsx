
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Mock user data
interface User {
  id: string;
  email: string;
  name: string;
  avatarInitials: string;
  plan: 'free' | 'pro' | 'business';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Export the AuthProvider as a named function component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auto-login with a default user - no authentication required
  const [user] = useState<User>({
    id: '1',
    email: 'user@zapier.com',
    name: 'Zapier User',
    avatarInitials: 'ZU',
    plan: 'free',
  });
  const [isLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dummy login function - not used
  const login = async (email: string, password: string) => {
    console.log('Login not required', email, password);
  };

  // Dummy signup function - not used
  const signUp = async (name: string, email: string, password: string) => {
    console.log('Signup not required', name, email, password);
  };

  // Dummy logout function - not used
  const logout = () => {
    console.log('Logout not required');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
