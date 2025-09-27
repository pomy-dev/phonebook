import { createStackNavigator } from "@react-navigation/stack";
import VacanciesScreen from "../screens/Vacancies"



// Create Stack Navigators for Home and Businesses
const VacancyStack = createStackNavigator();
export default function VacancyStackNavigator() {
  return (
    <VacancyStack.Navigator>
      <VacancyStack.Screen name="Vancacy" component={VacanciesScreen} options={{ headerShown: false }} />
    </VacancyStack.Navigator>
  );
}