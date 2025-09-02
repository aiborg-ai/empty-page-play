import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthStrategy, AuthResult, User, Credentials } from '../types/auth';
import { InstantAuthStrategy } from '../strategies/InstantAuthStrategy';
import { SupabaseAuthStrategy } from '../strategies/SupabaseAuthStrategy';
import { ProductionAuthStrategy } from '../strategies/ProductionAuthStrategy';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (credentials: Credentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (credentials: Credentials & { metadata?: any }) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  strategies?: AuthStrategy[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children,
  strategies = [
    new InstantAuthStrategy(),
    new SupabaseAuthStrategy(),
    new ProductionAuthStrategy()
  ]
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentStrategy, setCurrentStrategy] = useState<AuthStrategy>(strategies[0]);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      for (const strategy of strategies) {
        const currentUser = await strategy.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setCurrentStrategy(strategy);
          break;
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: Credentials): Promise<AuthResult> => {
    setError(null);
    setLoading(true);
    
    for (const strategy of strategies) {
      try {
        const result = await strategy.login(credentials);
        if (result.success) {
          setUser(result.user || null);
          setCurrentStrategy(strategy);
          setLoading(false);
          return result;
        }
      } catch (err) {
        console.error(`Auth strategy ${strategy.constructor.name} failed:`, err);
      }
    }
    
    const failureResult: AuthResult = {
      success: false,
      error: 'Authentication failed with all strategies'
    };
    
    setError(new Error(failureResult.error));
    setLoading(false);
    return failureResult;
  };

  const logout = async () => {
    try {
      setLoading(true);
      await currentStrategy.logout();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: Credentials & { metadata?: any }): Promise<AuthResult> => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await currentStrategy.register(credentials);
      if (result.success) {
        setUser(result.user || null);
      } else {
        setError(new Error(result.error));
      }
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await currentStrategy.resetPassword(email);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = await currentStrategy.updateProfile(updates);
      setUser(updatedUser);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const currentUser = await currentStrategy.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};