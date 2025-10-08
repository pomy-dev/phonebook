import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  Chip,
  FAB,
  Menu,
  Text,
  Searchbar
} from 'react-native-paper';
import { mockAreas, mockCategories, mockVendors } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function SearchScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || '');
  const [selectedArea, setSelectedArea] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  useEffect(() => {
    filterVendors();
  }, [searchQuery, selectedCategory, selectedArea, sortBy]);

  const filterVendors = () => {
    let filtered = [...mockVendors];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(vendor =>
        vendor.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by area
    if (selectedArea) {
      filtered = filtered.filter(vendor =>
        vendor.location.area.toLowerCase() === selectedArea.toLowerCase()
      );
    }

    // Sort vendors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return Math.random() - 0.5; // Simulate distance sorting
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return Math.random() - 0.5; // Simulate price sorting
        default:
          return 0;
      }
    });

    setFilteredVendors(filtered);
  };

  const handleVendorPress = (vendor) => {
    Alert.alert(
      'Vendor Details',
      `Name: ${vendor.name}\nType: ${vendor.type}\nCategory: ${vendor.category}\nRating: ${vendor.rating}\nLocation: ${vendor.location.area}\n\nWould you like to place an order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => console.log('View vendor details') },
        { text: 'Place Order', onPress: () => handlePlaceOrder(vendor) }
      ]
    );
  };

  const handlePlaceOrder = (vendor) => {
    Alert.alert(
      'Place Order',
      `Order from ${vendor.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Vendor', onPress: () => console.log('Call vendor') },
        { text: 'WhatsApp', onPress: () => console.log('WhatsApp vendor') }
      ]
    );
  };

  const renderVendorCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleVendorPress(item)}>
      <Card style={styles.vendorCard}>
        <Card.Content>
          <View style={styles.vendorHeader}>
            <Avatar.Image
              size={60}
              source={{ uri: item.profileImage }}
              style={styles.vendorAvatar}
            />
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorType}>{item.type} • {item.category}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{item.rating}</Text>
                <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
              </View>
            </View>
            <Badge style={[styles.statusBadge, { backgroundColor: item.isOnline ? theme.colors.success : theme.colors.disabled }]}>
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
              <Ionicons name="car-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{item.deliveryRadius}km delivery</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{item.contact.phone}</Text>
            </View>
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.stockTitle}>Available Stock:</Text>
            <View style={styles.stockItems}>
              {item.stock.filter(item => item.available).slice(0, 3)?.map((stockItem, index) => (
                <Chip key={index} style={styles.stockChip} compact>
                  {stockItem.item} - E{stockItem.price}
                </Chip>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color={theme.colors.disabled} />
      <Text style={styles.emptyTitle}>No vendors found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search criteria or explore different categories
      </Text>
      <Button
        mode="outlined"
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('');
          setSelectedArea('');
        }}
        style={styles.clearFiltersButton}
      >
        Clear Filters
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search vendors, products, or areas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />

        <View style={styles.filterContainer}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSortMenuVisible(true)}
                style={styles.sortButton}
                icon="sort"
              >
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            }
          >
            <Menu.Item onPress={() => { setSortBy('rating'); setSortMenuVisible(false); }} title="Rating" />
            <Menu.Item onPress={() => { setSortBy('distance'); setSortMenuVisible(false); }} title="Distance" />
            <Menu.Item onPress={() => { setSortBy('name'); setSortMenuVisible(false); }} title="Name" />
            <Menu.Item onPress={() => { setSortBy('price'); setSortMenuVisible(false); }} title="Price" />
          </Menu>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <Chip
            selected={!selectedCategory}
            onPress={() => setSelectedCategory('')}
            style={styles.filterChip}
          >
            All Categories
          </Chip>
          {mockCategories?.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.name}
              onPress={() => setSelectedCategory(category.name)}
              style={styles.filterChip}
            >
              {category.icon} {category.name}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <Chip
            selected={!selectedArea}
            onPress={() => setSelectedArea('')}
            style={styles.filterChip}
          >
            All Areas
          </Chip>
          {mockAreas?.map((area) => (
            <Chip
              key={area}
              selected={selectedArea === area}
              onPress={() => setSelectedArea(area)}
              style={styles.filterChip}
            >
              {area}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredVendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.vendorList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="map"
        style={styles.fab}
        onPress={() => Alert.alert('Map View', 'Map view coming soon!')}
        label="Map View"
      />
    </View>
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
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  searchBar: {
    backgroundColor: 'white',
    elevation: 4,
    marginBottom: 12,
  },
  filterContainer: {
    alignItems: 'flex-end',
  },
  sortButton: {
    borderColor: 'white',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    elevation: 2,
  },
  filtersScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  vendorList: {
    padding: 20,
    paddingBottom: 100,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vendorType: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
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
  statusBadge: {
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
    marginBottom: 12,
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
  stockContainer: {
    marginTop: 8,
  },
  stockTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  stockItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stockChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: theme.colors.surface,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: theme.colors.placeholder,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    borderColor: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    marginHorizontal: 16,
    marginVertical: 60,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
});
