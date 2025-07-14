import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = (options = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    autoRedirect = false,
    redirectPath = '/login',
    skipInitialCheck = false
  } = options;

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.checkAuthStatus();
      
      if (result.success && result.authenticated) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { authenticated: true, user: result.user };
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return { authenticated: false, user: null };
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
      return { authenticated: false, user: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      console.error('Logout failed:', err);
      // Clear local state even if logout request fails
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err.message };
    }
  };

  const refreshAuth = () => {
    return checkAuth();
  };

  useEffect(() => {
    if (!skipInitialCheck) {
      checkAuth();
    }
  }, [skipInitialCheck]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    checkAuth,
    logout,
    refreshAuth
  };
};

export const useAuthRequired = (redirectPath = '/login') => {
  const auth = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return {
    ...auth,
    shouldRedirect,
    redirectPath
  };
};