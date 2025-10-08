import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/local-market/VendorLogin";
import VendorRegistrationScreen from "../screens/local-market/AddVendor";
import HomeScreen from "../screens/local-market/VendorHome";
import BulkGroupsScreen from "../screens/local-market/BulkGroupScreen";
import SearchScreen from "../screens/local-market/SearchScreen";
import OrdersScreen from "../screens/local-market/OrderScreen";
import ProfileScreen from "../screens/local-market/ProfileScreen";
import SupplyChainScreen from "../screens/local-market/SupplyChain";

// Create Stack Navigators for Home and Businesses
const LocalMarketStack = createStackNavigator();
export default function LocalMarketStackNavigator() {
  return (
    <LocalMarketStack.Navigator>
      <LocalMarketStack.Screen name="VendorLogin" component={LoginScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="AddVendor" component={VendorRegistrationScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="VendorHome" component={HomeScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="BulkGroupsScreen" component={BulkGroupsScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="OrdersScreen" component={OrdersScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="LocalMarket" component={LoginScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <LocalMarketStack.Screen name="SupplyChain" component={SupplyChainScreen} options={{ headerShown: false }} />
    </LocalMarketStack.Navigator>
  );
}