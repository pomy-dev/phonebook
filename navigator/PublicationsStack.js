import { createStackNavigator } from '@react-navigation/stack';
import PublicationScreen from "../screens/PublicationScreen";
import BusinessArticlesScreen from "../screens/BusinessArticlesScreen";

const PublicationsStack = createStackNavigator();
export default function PublicationsStackNavigator() {
  return (
    <PublicationsStack.Navigator>
      <PublicationsStack.Screen name="Publications" component={PublicationScreen} options={{ headerShown: false }} />
      <PublicationsStack.Screen name="Promotions" component={BusinessArticlesScreen} options={{ headerShown: false }} />
    </PublicationsStack.Navigator>
  );
}