import { useRef, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, Animated, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './components/TabNavigator';
import Toast from 'react-native-toast-message';
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from './screens/SplashScreen'; // Import the SplashScreen component
import CustomDrawerContent from './components/Drawer';

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
                    { id: "eswatini", name: "eSwatini", coatOfArmsIcon: "shield-outline", flagIcon: "flag-outline" },
                    { id: "south_africa", name: "South Africa", coatOfArmsIcon: "shield-outline", flagIcon: "flag-outline" },
                    { id: "mozambique", name: "Mozambique", coatOfArmsIcon: "shield-outline", flagIcon: "flag-outline" },
                  ]}
                // Pass other props as needed
                />
              )}
            >
              <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
              {/* Add other screens here */}
            </Drawer.Navigator>
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});