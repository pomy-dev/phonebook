import { Ionicons } from '@expo/vector-icons';
import { Icons } from '../../constants/Icons'
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Text,
  Searchbar
} from 'react-native-paper';
import { mockCategories, mockVendors } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [nearbyVendors, setNearbyVendors] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);

  useEffect(() => {
    // Simulate loading nearby vendors
    setNearbyVendors(mockVendors.filter(vendor => vendor.isOnline));
    setFeaturedVendors(mockVendors.filter(vendor => vendor.rating > 4.5));
  }, []);

  const handleSearch = () => {
    navigation.navigate('SearchScreen', {
      query: searchQuery,
      category: selectedCategory
    });
  };

  const handleVendorPress = (vendor) => {
    // Navigate to vendor details
    console.log('Navigate to vendor:', vendor.name);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.name);
    navigation.navigate('SearchScreen', {
      query: '',
      category: category.name
    });
  };

  const renderVendorCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleVendorPress(item)}>
      <Card style={styles.vendorCard}>
        <Card.Content>
          <View style={styles.vendorHeader}>
            <Avatar.Image
              size={50}
              source={{ uri: item.profileImage }}
              style={styles.vendorAvatar}
            />
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorType}>{item.type}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{item.rating}</Text>
                <Text style={styles.reviewCount}>({item.reviewCount})</Text>
              </View>
            </View>
            <Badge style={styles.onlineBadge}>
              {item.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </View>

          <Text style={styles.vendorDescription}>
            {item.description}
          </Text>

          <View style={styles.vendorDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{item.location.area}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>
                {item.workingHours.monday || 'Closed today'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="car-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{item.deliveryRadius}km delivery</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
      <Card style={styles.categoryCard}>
        <Card.Content style={styles.categoryContent}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryName}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.headerTitle}>Find Local Vendors</Text>
          </View>
          <>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} style={styles.notificationButton}>
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Badge style={styles.notificationBadge}>3</Badge>
            </TouchableOpacity>
          </>

        </View>

        <Searchbar
          placeholder="Search vendors, products, or areas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={mockCategories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Vendors</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('SearchScreen', { sortBy: 'distance' })}
            compact
          >
            See All
          </Button>
        </View>

        <FlatList
          data={nearbyVendors}
          renderItem={renderVendorCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.vendorList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('SearchScreen', { sortBy: 'rating' })}
            compact
          >
            See All
          </Button>
        </View>

        <FlatList
          data={featuredVendors}
          renderItem={renderVendorCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.vendorList}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('BulkGroupsScreen')}
          >
            <Ionicons name="people" size={32} color={theme.colors.primary} />
            <Text style={styles.actionText}>Join Bulk Groups</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('OrdersScreen')}
          >
            <Ionicons name="receipt" size={32} color={theme.colors.primary} />
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SupplyChain')}
          >
            <Icons.FontAwesome6 name="group-arrows-rotate" size={32} color={theme.colors.primary} />
            <Text style={styles.actionText}>Supply Chain</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Supporting local businesses in Swaziland 🇸🇿
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
  },
  searchBar: {
    backgroundColor: 'white',
    elevation: 4,
  },
  section: {
    margin: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 100,
    marginRight: 12,
    elevation: 2,
  },
  categoryContent: {
    alignItems: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: '500',
  },
  vendorList: {
    paddingBottom: 10,
  },
  vendorCard: {
    marginBottom: 16,
    elevation: 4,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vendorAvatar: {
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vendorType: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginLeft: 4,
  },
  onlineBadge: {
    backgroundColor: theme.colors.success,
    color: 'white',
    fontSize: 10,
  },
  vendorDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  vendorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    color: theme.colors.placeholder,
    fontSize: 14,
  },
});
