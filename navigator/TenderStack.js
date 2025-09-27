import { createStackNavigator } from "@react-navigation/stack";
import TendersScreen from "../screens/Tenders"



// Create Stack Navigators for Home and Businesses
const TenderStack = createStackNavigator();
export default function TenderStackNavigator() {
  return (
    <TenderStack.Navigator>
      <TenderStack.Screen name="Tender" component={TendersScreen} options={{ headerShown: false }} />
    </TenderStack.Navigator>
  );
}