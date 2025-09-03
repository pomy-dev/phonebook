"use client"
import { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import CustomTabBar from "./CustomTabBar"
import HomeStackNavigator from "../navigator/HomeStack"
import BusinessesStackNavigator from "../navigator/BusinessesStack"
import FavoritesStackNavigator from "../navigator/FavoritesStack"
import NotificationsStackNavigator from "../navigator/NotificationStack"
import { AppContext } from '../context/appContext';

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    const { isDarkMode, theme } = useContext(AppContext);

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} isDarkMode={isDarkMode} theme={theme} />}
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{
                    tabBarLabel: "Home",
                }}
            />
            <Tab.Screen
                name="Countries"
                component={BusinessesStackNavigator}
                options={{
                    tabBarLabel: "Business",
                }}
            />
            <Tab.Screen
                name="Nots"
                component={NotificationsStackNavigator}
                options={{
                    tabBarLabel: "Notifications",
                }}
            />
            <Tab.Screen
                name="4IS"
                component={FavoritesStackNavigator}
                options={{
                    tabBarLabel: "Favorites",
                }}
            />
        </Tab.Navigator>
    )
}

