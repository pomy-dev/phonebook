import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Icons } from "../utils/Icons";

const CustomDrawerContent = ({
  states,
  selectedState,
  setSelectedState,
  isDarkMode,
  notificationsEnabled,
  isOnline,
  toggleTheme,
  toggleNotifications,
  toggleOnlineMode,
  navigation,
}) => {
  
  return (
    <DrawerContentScrollView
      style={[styles.drawerContainer, isDarkMode && styles.darkDrawerContainer]}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={true}
    >
      <View style={styles.drawerContent}>
        <Text style={[styles.drawerTitle, isDarkMode && styles.darkText]}>Menu</Text>

        {/* States Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Switch Directory</Text>
        {states.map((state) => (
          <TouchableOpacity
            key={state.id}
            style={[
              styles.drawerItem,
              selectedState === state.name && styles.activeDrawerItem,
            ]}
            onPress={() => {
              setSelectedState(state.name);
              navigation.closeDrawer();
            }}
          >
            <Icons.Ionicons
              name={state.icon}
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#757474ff"}
              style={styles.icon}
            />
            <Text style={[styles.itemText, isDarkMode && styles.darkText]}>{state.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Navigation Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Daily Trends</Text>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate("Publications");
            navigation.closeDrawer();
          }}
        >
          <Icons.Ionicons
            name="newspaper-outline"
            size={20}
            color={isDarkMode ? "#FFFFFF" : "#757474ff"}
            style={styles.icon}
          />
          <Text style={[styles.itemText, isDarkMode && styles.darkText]}>Publications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate("BusinessPromotions");
            navigation.closeDrawer();
          }}
        >
          <Icons.Ionicons
            name="megaphone-outline"
            size={20}
            color={isDarkMode ? "#FFFFFF" : "#757474ff"}
            style={styles.icon}
          />
          <Text style={[styles.itemText, isDarkMode && styles.darkText]}>Business Promotions</Text>
        </TouchableOpacity>

        {/* Settings Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Settings</Text>
        <View style={styles.drawerItem}>
          <Icons.Ionicons
            name={isDarkMode ? "moon-outline" : "sunny-outline"}
            size={20}
            color={isDarkMode ? "#FFFFFF" : "#757474ff"}
            style={styles.icon}
          />
          <Text style={[styles.itemText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <View style={styles.drawerItem}>
          <Icons.Ionicons
            name="notifications-outline"
            size={20}
            color={isDarkMode ? "#FFFFFF" : "#757474ff"}
            style={styles.icon}
          />
          <Text style={[styles.itemText, isDarkMode && styles.darkText]}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <View style={styles.drawerItem}>
          <Icons.Ionicons
            name={isOnline ? "wifi-outline" : "cloud-offline-outline"}
            size={20}
            color={isDarkMode ? "#FFFFFF" : "#757474ff"}
            style={styles.icon}
          />
          <Text style={[styles.itemText, isDarkMode && styles.darkText]}>
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isOnline ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: "#003366"
  },
  darkDrawerContainer: {
    backgroundColor: "#0363c3ff",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  drawerContent: {
    padding: 5,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginVertical: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeDrawerItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  itemText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 10,
    flex: 1,
  },
  darkText: {
    color: "#FFFFFF",
  },
  icon: {
    marginRight: 8,
  },
});

export default CustomDrawerContent;