// App.js
import 'react-native-gesture-handler';
import { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import PublicationsStackNavigator from './navigator/PublicationsStack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from './screens/SplashScreen';
import CustomDrawerContent from './components/Drawer';
import { Images } from './constants/Images';
import { AppContext, AppProvider } from './context/appContext';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Drawer = createDrawerNavigator();

// Request notification permissions
async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowBadge: false,
    },
  });
  if (status !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      enableLights: true,
      enableVibrate: true,
    });
  }
  return true;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isDarkMode, theme, selectedState, setSelectedState, notificationsEnabled, addNotification, isOnline, toggleTheme, toggleNotifications, toggleOnlineMode } = useContext(AppContext);
  const [isAppReady, setIsAppReady] = useState(false);
  const navigationRef = useNavigationContainerRef();

  // Notification observer logic
  useEffect(() => {
    let isMounted = true;

    // In App.js, update the handleNotification function
    const handleNotification = (notification) => {
      if (!notificationsEnabled) return;
      const notificationData = {
        id: notification.request.content.data?.notificationId || Date.now().toString(),
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        timestamp: new Date().toISOString(),
      };

      addNotification(notificationData);

      navigationRef.navigate('Nots', {
        screen: 'Notifications',
        params: {
          screen: 'Notifications',
          params: { notificationId: notificationData.id }
        },
      });
    };

    // Check for notifications that launched the app
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) return;
      handleNotification(response.notification);
    });

    // Listen for notification taps while the app is running
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotification(response.notification);
    });

    // Request permissions on mount
    requestNotificationPermissions();

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [navigationRef, notificationsEnabled, addNotification]);

  const toastConfig = {
    success: ({ text1, text2 }) => (
      <View
        style={{
          height: 60,
          width: '90%',
          backgroundColor: theme.colors.background,
          borderRadius: 10,
          padding: 10,
          justifyContent: 'center',
          borderWidth: 1,
          borderLeftColor: theme.colors.indicator,
          borderTopColor: theme.colors.secondary,
          borderRightColor: theme.colors.secondary,
          borderBottomColor: theme.colors.secondary,
          borderLeftWidth: 4,
          zIndex: 9999,
          elevation: 9999,
        }}
      >
        <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{text1}</Text>
        <Text style={{ color: theme.colors.text }}>{text2}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaProvider>
      {!isAppReady ? (
        <SplashScreen onConnectionSuccess={() => setIsAppReady(true)} />
      ) : (
        <>
          <NavigationContainer ref={navigationRef} theme={theme}>
            <Drawer.Navigator
              drawerContent={(props) => (
                <CustomDrawerContent
                  {...props}
                  states={[
                    { id: 'bs_eswatini', name: 'Business eSwatini', coatOfArmsIcon: Images.bs_eswatini, flagIcon: 'flag-outline' },
                    { id: 'eptc', name: 'E.P.T.C', coatOfArmsIcon: Images.eptc, flagIcon: 'flag-outline' },
                  ]}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  isDarkMode={isDarkMode}
                  notificationsEnabled={notificationsEnabled}
                  isOnline={isOnline}
                  toggleTheme={toggleTheme}
                  toggleNotifications={toggleNotifications}
                  toggleOnlineMode={toggleOnlineMode}
                />
              )}
              screenOptions={{
                drawerStyle: {
                  width: 250,
                },
              }}
            >
              <Drawer.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
              <Drawer.Screen
                name="Publications"
                component={PublicationsStackNavigator}
                options={{ headerShown: false }}
                initialParams={{ selectedState, contentType: 'Publications' }}
              />
              <Drawer.Screen
                name="Promotions"
                component={PublicationsStackNavigator}
                options={{ headerShown: false }}
                initialParams={{ selectedState, contentType: 'Promotions' }}
              />
            </Drawer.Navigator>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </>
      )}
    </SafeAreaProvider>
  );
}