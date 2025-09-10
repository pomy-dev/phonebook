// AppContext.js
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomDarkTheme, CustomLightTheme } from '../constants/colors';
import { fetchNotifications } from '../service/getApi'; // <-- your API call

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedState, setSelectedState] = useState('E.P.T.C');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Load persisted state + fetch fresh notifications
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        const state = await AsyncStorage.getItem('selectedState');
        const online = await AsyncStorage.getItem('isOnline');
        const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
        const notifList = await AsyncStorage.getItem('notifications');

        if (theme) setIsDarkMode(JSON.parse(theme));
        if (state) setSelectedState(JSON.parse(state));
        if (online) setIsOnline(JSON.parse(online));
        if (notifEnabled) setNotificationsEnabled(JSON.parse(notifEnabled));
        if (notifList) setNotifications(JSON.parse(notifList));
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Fetch new notifications when online
  useEffect(() => {
    const loadApiNotifications = async () => {
      try {
        if (isOnline && notificationsEnabled) {
          const fresh = await fetchNotifications();
          setNotifications(fresh); // overwrite with fresh ones
        }
      } catch (err) {
        console.log('Error fetching notifications:', err);
      }
    };
    loadApiNotifications();
  }, [isOnline, notificationsEnabled]);

  // =================================Persist values when they change===================================

  // Persist theme
  useEffect(() => {
    AsyncStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Persist selectedState
  useEffect(() => {
    AsyncStorage.setItem('selectedState', JSON.stringify(selectedState));
  }, [selectedState]);

  // Persist isOnline
  useEffect(() => {
    AsyncStorage.setItem('isOnline', JSON.stringify(isOnline));
  }, [isOnline]);

  // Persist notificationsEnabled
  useEffect(() => {
    AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Persist notifications
  useEffect(() => {
    AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleOnlineMode = () => setIsOnline(!isOnline);

  const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

   const addNotification = (notification) => {
    setNotifications((prev) => {
      // Check if the notification already exists
      const exists = prev.some((item) => item._id === notification._id);
      if (!exists) {
        // If it doesn't exist, add it to the list
        return [notification, ...prev];
      }
      // If it exists, return the previous state unchanged
      return prev;
    });
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
