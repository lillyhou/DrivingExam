import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserInfo = {
  name: string;
  email: string;
};


type AuthContextType = {
  accessToken: string | null;
  user: UserInfo | null;
    loading: boolean;  
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UserInfo | null>(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromStorage = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');
       console.log('Loaded from storage:', { storedToken, storedUser });
      if (storedToken) setAccessTokenState(storedToken);
      if (storedUser) setUserState(JSON.parse(storedUser));
       setLoading(false);
    };
    loadFromStorage();
  }, []);

  const setAccessToken = async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem('accessToken', token);
    } else {
      await AsyncStorage.removeItem('accessToken');
    }
    setAccessTokenState(token);
  };

  const setUser = async (user: UserInfo | null) => {
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('user');
    }
    setUserState(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    setAccessTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, setAccessToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
