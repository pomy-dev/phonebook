import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import BusinessDetailsScreen from "../screens/BusinessDetailsScreen"

const FavoriteStack = createStackNavigator();
export default function FavoritesStackNavigator() {
  return (
    <FavoriteStack.Navigator>
      <FavoriteStack.Screen name="FavoritesMain" component={FavoritesScreen} options={{ headerShown: false }} />
      <FavoriteStack.Screen name="BusinessDetail" component={BusinessDetailsScreen} options={{ headerShown: false }} />
    </FavoriteStack.Navigator>
  );
}