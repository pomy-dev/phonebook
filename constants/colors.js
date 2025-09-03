import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#003366',
    background: '#FFFFFF',
    secondary: '#f8f7f7ff',
    card: '#FFFFFF',
    sub_card: '#f0f0f0ff',
    text: '#333333',
    light: '#3a3a3aff',
    indicator: "#003366",
    border: '#e9e8e8ff',
    notification: '#FF4500',
  },
};

// Define a custom dark theme
export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#003366',
    background: '#1E293B',
    secondary: '#CCCC',
    card: '#415970ff',
    sub_card: '#415970ff',
    text: '#CCC',
    light: '#FFFFFF',
    indicator: "#5a85b0ff",
    border: '#272727',
    notification: '#FF4500',
  },
};