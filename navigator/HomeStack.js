import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home"
import ProfileScreen from "../screens/AddProfile"
import BusinessDetailsScreen from "../screens/BusinessDetailsScreen"
import FeaturedScreen from "../screens/FeaturedScreen"
import BusinessArticlesScreen from "../screens/BusinessArticlesScreen"
import NotificationList from "../screens/NotificationList"



// Create Stack Navigators for Home and Businesses
const HomeStack = createStackNavigator();
export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="BusinessDetail" component={BusinessDetailsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="BusinessArticle" component={BusinessArticlesScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Featured" component={FeaturedScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Notifications" component={NotificationList} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}