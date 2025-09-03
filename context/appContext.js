// AppContext.js
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomDarkTheme, CustomLightTheme } from '../constants/colors';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedState, setSelectedState] = useState('E.P.T.C');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Load persisted state
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        const state = await AsyncStorage.getItem('selectedState');
        const online = await AsyncStorage.getItem('isOnline');

        if (theme !== null) setIsDarkMode(JSON.parse(theme));
        if (state !== null) setSelectedState(JSON.parse(state));
        if (notifications !== null) setNotificationsEnabled(JSON.parse(notifications));
        if (online !== null) setIsOnline(JSON.parse(online));
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Persist theme changes
  useEffect(() => {
    AsyncStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Persist state selection
  useEffect(() => {
    AsyncStorage.setItem('selectedState', JSON.stringify(selectedState));
  }, [selectedState]);

  // Persist notifications
  useEffect(() => {
    AsyncStorage.setItem('notifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Persist online status
  useEffect(() => {
    AsyncStorage.setItem('isOnline', JSON.stringify(isOnline));
  }, [isOnline]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleOnlineMode = () => setIsOnline(!isOnline);

  const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;
  // Function to add a new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]); // Add new notification to the start
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        selectedState,
        setSelectedState,
        notificationsEnabled,
        setNotificationsEnabled,
        isOnline,
        setIsOnline,
        toggleTheme,
        toggleNotifications,
        toggleOnlineMode,
        theme,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};