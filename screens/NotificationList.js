// screens/NotificationListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../context/appContext';
import { Icons } from '../constants/Icons';
import { mockNotifications } from '../utils/mockNotifications';

const NotificationListScreen = () => {
  const { theme } = React.useContext(AppContext);
  const route = useRoute();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const selectedNotificationId = route.params?.notificationId; // Get notification ID from params

  // Find company logo based on businessId
  const getCompanyLogo = (businessId) => {
    const company = mockNotifications.find((c) => c._id === businessId);
    return company ? company.logo : null;
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: selectedNotificationId === item.id ? theme.colors.primary : theme.colors.card },
      ]}
      onPress={() => {
        if (item.data.url === 'BusinessDetail') {
          navigation.navigate('Tabs', {
            screen: 'HomeStack',
            params: { screen: 'BusinessDetail', params: { businessId: item.data.businessId } },
          });
        }
      }}
    >
      {item.data.businessId && (
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: getCompanyLogo(item.data.businessId) }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.notificationBody, { color: theme.colors.text }]}>{item.body}</Text>
        <Text style={[styles.notificationTime, { color: theme.colors.text }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={[styles.noNotifications, { color: theme.colors.text }]}>No notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: "center",
    paddingTop: 30
  },
  noNotifications: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  logoContainer: {
    marginRight: 12,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default NotificationListScreen;