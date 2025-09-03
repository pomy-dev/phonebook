import { createStackNavigator } from "@react-navigation/stack";
import BusinessDetailsScreen from "../screens/BusinessDetailsScreen"
import NotificationList from "../screens/NotificationList"



// Create Stack Navigators for Home and Businesses
const NoticeStack = createStackNavigator();
export default function NotificationsStackNavigator() {
  return (
    <NoticeStack.Navigator>
      <NoticeStack.Screen name="Notifications" component={NotificationList} options={{ headerShown: false }} />
      <NoticeStack.Screen name="BusinessDetail" component={BusinessDetailsScreen} options={{ headerShown: false }} />
    </NoticeStack.Navigator>
  );
}