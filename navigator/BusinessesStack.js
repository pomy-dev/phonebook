import { createStackNavigator } from '@react-navigation/stack';
import BusinessesScreen from '../screens/BusinessesScreen';
import BusinessDetailsScreen from "../screens/BusinessDetailsScreen"
import BusinessList from "../screens/BusinessListScreen"
import BusinessArticlesScreen from "../screens/BusinessArticlesScreen"

const BusinessesStack = createStackNavigator();
export default function BusinessesStackNavigator() {
    return (
        <BusinessesStack.Navigator>
            <BusinessesStack.Screen name="BusinessesMain" component={BusinessesScreen} options={{ headerShown: false }} />
            <BusinessesStack.Screen name="BusinessDetail" component={BusinessDetailsScreen} options={{ headerShown: false }} />
            <BusinessesStack.Screen name="BusinessList" component={BusinessList} options={{ headerShown: false }} />
            <BusinessesStack.Screen name="BusinessArticle" component={BusinessArticlesScreen} options={{ headerShown: false }} />
        </BusinessesStack.Navigator>
    );
}