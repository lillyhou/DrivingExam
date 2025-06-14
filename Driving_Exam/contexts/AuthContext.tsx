import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthActions = {
  setActiveUser: (user: string | null) => void;
  logout: () => Promise<void>;
};

type AuthContextType = {
  activeUser: string | null;
  actions: AuthActions;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user from backend on mount
 useEffect(() => {
  async function fetchUser() {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
      const url = `${apiUrl.replace(/\/$/, '')}/oauth/me`;
      const res = await fetch(url, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setActiveUser(data.username || null);
      } else {
        setActiveUser(null);
      }
    } catch (err) {
      setActiveUser(null);
    }
  }
  fetchUser();
}, []);

  // Logout function calls backend and clears state
  const logout = async () => {
    try {
      await fetch('https://your-backend.com/oauth/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed', err);
    }
    setActiveUser(null);
    router.replace('/'); // or wherever you want to redirect after logout
  };

  return (
   <AuthContext.Provider value={{ activeUser, actions: { setActiveUser, logout } }}>
    {children}
  </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
