import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth0 from 'react-native-auth0';
import { jwtDecode } from 'jwt-decode';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_REDIRECT_URI, AUTH0_LOGOUT_REDIRECT_URI } from '../config/env';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
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
        redirectUri: AUTH0_REDIRECT_URI,
      });

      // Decode the JWT to get user info
      const decodedUser = jwtDecode(credentials.idToken);

      // Store tokens & user info
      setAccessToken(credentials.accessToken);
      setUser(decodedUser);
      await AsyncStorage.setItem('accessToken', credentials.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(decodedUser));

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
        returnTo: AUTH0_LOGOUT_REDIRECT_URI,
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