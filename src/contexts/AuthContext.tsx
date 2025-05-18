
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('zapier_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'user@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          email: email,
          name: 'John Doe',
          avatarInitials: 'JD',
          plan: 'free',
        };
        
        localStorage.setItem('zapier_user', JSON.stringify(userData));
        setUser(userData);
        
        const from = (location.state as any)?.from || '/';
        navigate(from);
        
        toast({
          title: 'Login successful',
          description: 'Welcome back to Zapier!',
        });
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock signup - in a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `${Date.now()}`,
        email: email,
        name: name,
        avatarInitials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        plan: 'free',
      };
      
      localStorage.setItem('zapier_user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      
      toast({
        title: 'Account created',
        description: 'Welcome to Zapier!',
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('zapier_user');
    setUser(null);
    navigate('/login');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
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
