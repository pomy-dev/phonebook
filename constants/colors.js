import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#003366',
    background: 'rgba(255, 255, 255, 0.98)',
    secondary: '#f8f7f7ff',
    card: '#FFFFFF',
    sub_card: '#f0f0f0ff',
    text: '#333333',
    sub_text: '#7d7d7dff',
    light: '#3a3a3aff',
    indicator: "#003366",
    border: '#e9e8e8ff',
    notification: '#FF4500',
    highlight: 'rgba(0, 0, 0, 0.5)'
  },
};

// Define a custom dark theme
export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#003366',
    primary2: '#151775ff',
    background: '#1E293B',
    secondary: '#CCCC',
    card: '#415970ff',
    sub_card: '#415970ff',
    text: '#CCC',
    sub_text: '#CCCC',
    light: '#FFFFFF',
    indicator: "#5a85b0ff",
    border: '#272727',
    notification: '#FF4500',
    highlight: 'rgba(0, 0, 0, 0.2)'
  },
};