// Simple authentication context and utilities
// In production, this would integrate with AWS Cognito or similar

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
}

const AUTH_STORAGE_KEY = 'autoinfra_user';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in production, this would be real authentication
    if (email && password.length >= 6) {
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        company: 'Demo Corp'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  signup: async (email: string, password: string, name: string, company: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email,
      name,
      company
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  }
};