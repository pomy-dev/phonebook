import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home"
import HomeScreenDetails from "../screens/HomeDetailsScreen"
import BusinessDetailsScreen from "../screens/BusinessDetailsScreen"
import FeaturedScreen from "../screens/FeaturedScreen"
import BusinessArticlesScreen from "../screens/BusinessArticlesScreen"



// Create Stack Navigators for Home and Businesses
const HomeStack = createStackNavigator();
export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="HomeDetails" component={HomeScreenDetails} options={{ headerShown: false }} />
      <HomeStack.Screen name="BusinessDetail" component={BusinessDetailsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="BusinessArticle" component={BusinessArticlesScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Featured" component={FeaturedScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}