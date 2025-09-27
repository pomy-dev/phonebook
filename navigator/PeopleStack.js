import { createStackNavigator } from "@react-navigation/stack";
import PeopleScreen from "../screens/PeopleProfiles"



// Create Stack Navigators for Home and Businesses
const PeopleStack = createStackNavigator();
export default function PeopleStackNavigator() {
  return (
    <PeopleStack.Navigator>
      <PeopleStack.Screen name="People" component={PeopleScreen} options={{ headerShown: false }} />
    </PeopleStack.Navigator>
  );
}