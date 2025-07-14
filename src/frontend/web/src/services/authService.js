const API_BASE_URL = 'http://localhost:5000';

export const authService = {
  // Check if user is authenticated
  checkAuthStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include'
      });
      const data = await response.json();
      return {
        success: true,
        authenticated: data.authenticated,
        user: data.user || null
      };
    } catch (error) {
      console.error('Auth check failed:', error);
      return {
        success: false,
        authenticated: false,
        user: null,
        error: error.message
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      return {
        success: response.ok,
        authenticated: data.authenticated || false,
        user: data.user || null,
        message: data.message,
        error: data.error
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        authenticated: false,
        user: null,
        error: error.message
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      return {
        success: response.ok,
        message: response.ok ? 'Logged out successfully' : 'Logout failed'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Make authenticated requests
  makeAuthenticatedRequest: async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include'
      });
      
      return {
        success: response.ok,
        status: response.status,
        response: response
      };
    } catch (error) {
      console.error('Authenticated request failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};