import { useRef, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './components/TabNavigator';
import SplashScreen from './screens/SplashScreen'; // Import the SplashScreen component

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

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

// Custom Tab Bar Icon with Animation using React Native's Animated API
function TabBarIcon({ name, color, size, focused }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? CustomDarkTheme : CustomLightTheme;
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <>
      {!isAppReady ? (
        // Show splash screen before the app is ready
        <SplashScreen onConnectionSuccess={() => setIsAppReady(true)} />
      ) : (
        // Show main app with navigation when ready
        <SafeAreaProvider>
          <NavigationContainer theme={theme}>
            <TabNavigator />
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </NavigationContainer>
        </SafeAreaProvider>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});