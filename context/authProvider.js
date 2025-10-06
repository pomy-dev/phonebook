import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'dev-3zyqmqx2ka58kywm.us.auth0.com',
  clientId: 'wuNnffEgLMLYx1G6ZSBL6ci2rL8b1VOT',
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const userInfo = await AsyncStorage.getItem('user');
      if (token && userInfo) {
        setAccessToken(token);
        setUser(JSON.parse(userInfo));
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const socialLogin = async (connection) => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        connection,
        redirectUri: 'businesslink://dev-3zyqmqx2ka58kywm.us.auth0.com/callback', // 👈 MUST match Auth0
      });

      setAccessToken(credentials.accessToken);
      setUser(credentials.idToken);
      await AsyncStorage.setItem('accessToken', credentials.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(credentials.idToken));

      return credentials;
    } catch (error) {
      console.error(`Social login (${connection}) failed:`, error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth0.webAuth.clearSession({
        federated: true,
        returnTo: 'businesslink://dev-3zyqmqx2ka58kywm.us.auth0.com/callback',
      });

      setAccessToken(null);
      setUser(null);
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const value = { socialLogin, logout, accessToken, user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};