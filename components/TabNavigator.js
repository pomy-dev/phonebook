"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTheme } from "@react-navigation/native"
import CustomTabBar from "./CustomTabBar"
import HomeStackNavigator from "../navigator/HomeStack"
import BusinessesStackNavigator from "../navigator/BusinessesStack"
import FavoritesScreen from "../screens/FavoritesScreen"

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    const theme = useTheme()

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} theme={theme} />}
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
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
                name="4IS"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: "Favorites",
                }}
            />
        </Tab.Navigator>
    )
}

