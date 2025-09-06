import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../context/appContext';
import { Icons } from '../constants/Icons';
import { mockNotifications } from '../utils/mockNotifications';

const NotificationListScreen = () => {
  const { theme } = React.useContext(AppContext);
  const route = useRoute();
  const listRef = useRef(null);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { notifications } = useContext(AppContext);
  const selectedNotificationId = route.params?.notificationId;
  const [error, setError] = useState(null);
  const [layoutMode, setLayoutMode] = useState('list');

  // Find company logo based on businessId
  // const getCompanyLogo = (businessId) => {
  //   const company = mockNotifications.find((c) => c._id === businessId);
  //   return company ? company.logo : null;
  // };

  const toggleLayout = () => {
    setLayoutMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  useEffect(() => {
    if (selectedNotificationId && notifications.length > 0 && listRef.current) {
      const index = notifications.findIndex((n) => n.id === selectedNotificationId);
      if (index !== -1) {
        listRef.current.scrollToIndex({ index, animated: true });
      }
    }
  }, [selectedNotificationId, notifications]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        layoutMode === 'grid' && [
          styles.gridItem,
          { width: (width - 48) / 2 },
        ],
        { backgroundColor: selectedNotificationId === item._id ? theme.colors.primary : theme.colors.card },
      ]}
      onPress={() => {
        navigation.navigate('Countries', {
          screen: 'BusinessDetail',
          params: { businessId: item._id },
        });
      }}
    >
      {/* Logo */}
      {item.company?.logo && (
        <View style={[styles.logoContainer, layoutMode === 'grid' && styles.gridLogoContainer]}>
          <Image
            source={{ uri: item.company.logo }}
            style={[
              styles.companyLogo,
              { borderColor: theme.colors.card, borderWidth: 1 },
              layoutMode === 'grid' && styles.gridCompanyLogo,
            ]}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Text */}
      <View style={[styles.textContainer, layoutMode === 'grid' && styles.gridTextContainer]}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title} ({item.category})
        </Text>
        <Text style={[styles.notificationBody, { color: theme.colors.text }]} numberOfLines={3}>
          {item.message}
        </Text>
        <Text style={[styles.companyInfo, { color: theme.colors.text }]}>
          {item.company?.company_name} • {item.company?.company_type}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.text }]}>
          {new Date(item.startDate).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* {isLoading && <CustomLoader />} */}
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={toggleLayout} style={styles.toggleButton}>
          <Icons.Ionicons
            name={layoutMode === 'list' ? 'grid-outline' : 'list-outline'}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: '#b34141' }]}>
          {error}
        </Text>
      )}
      {notifications.length === 0 ? (
        <Text style={[styles.noNotifications, { color: theme.colors.text }]}>No notifications</Text>
      ) : (
        <FlatList
          ref={listRef}
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          key={layoutMode} // Force re-render when layout changes
          numColumns={layoutMode === 'grid' ? 2 : 1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     colors={[theme.colors.primary]}
        //     tintColor="transparent"
        //     progressBackgroundColor={theme.colors.card}
        //   />
        // }
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 8,
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
  gridItem: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 4,
    padding: 12,
  },
  logoContainer: {
    marginRight: 12,
  },
  gridLogoContainer: {
    marginRight: 0,
    marginBottom: 8,
    alignItems: 'center',
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  gridCompanyLogo: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
  },
  gridTextContainer: {
    flex: 1,
    alignItems: 'center',
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
  companyInfo: {
    fontSize: 13,
    fontStyle: 'italic',
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default NotificationListScreen;