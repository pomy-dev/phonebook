import 'react-native-gesture-handler';
import { useState } from 'react';
import { useColorScheme, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import PublicationsStackNavigator from './navigator/PublicationsStack';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './components/TabNavigator';
import Toast from 'react-native-toast-message';
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from './screens/SplashScreen';
import CustomDrawerContent from './components/Drawer';
import { Images } from './utils/Images';

const Drawer = createDrawerNavigator();

// Define a custom light theme
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#003366',
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#333333',
    border: '#CCCCCC',
    notification: '#FF4500',
  },
};

// Define a custom dark theme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#003366',
    background: '#000000',
    card: '#121212',
    text: '#FFFFFF',
    border: '#272727',
    notification: '#FF4500',
  },
};

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? CustomDarkTheme : CustomLightTheme;
  const [isAppReady, setIsAppReady] = useState(false);
  const [selectedState, setSelectedState] = useState("eSwatini");
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const toastConfig = {
    success: ({ text1, text2 }) => (
      <View
        style={{
          height: 60,
          width: '90%',
          backgroundColor: isDark ? '#FFFFFF' : 'rgba(247, 245, 245, 0.99)',
          borderRadius: 10,
          padding: 10,
          justifyContent: 'center',
          borderWidth: 1,
          borderLeftColor: '#003366',
          borderTopColor: '#CCCCCC',
          borderRightColor: '#CCCCCC',
          borderBottomColor: '#CCCCCC',
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleOnlineMode = () => setIsOnline(!isOnline);

  return (
    <SafeAreaProvider>
      {!isAppReady ? (
        // Show splash screen before the app is ready
        <SplashScreen onConnectionSuccess={() => setIsAppReady(true)} />
      ) : (
        // Show main app with navigation when ready
        <>
          <NavigationContainer theme={theme}>
            <Drawer.Navigator
              drawerContent={(props) => (
                <CustomDrawerContent
                  {...props}
                  states={[
                    { id: "eswatini", name: "eSwatini", coatOfArmsIcon: Images.swatiEmblem, flagIcon: "flag-outline" },
                    { id: "south_africa", name: "South Africa", coatOfArmsIcon: Images.mzansiEmblem, flagIcon: "flag-outline" },
                    { id: "mozambique", name: "Mozambique", coatOfArmsIcon: Images.mozEmblem, flagIcon: "flag-outline" },
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
                  width: 250, // Set exact drawer width
                },
              }}
            >
              <Drawer.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
              <Drawer.Screen name="Publications" component={PublicationsStackNavigator}
                options={{ headerShown: false }}
                initialParams={{ selectedState }}
              />
            </Drawer.Navigator>
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </>
      )}
    </SafeAreaProvider>
  );
}