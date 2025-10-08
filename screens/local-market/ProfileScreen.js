import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  FAB,
  List,
  Modal,
  Text,
  Portal,
  Switch,
  TextInput
} from 'react-native-paper';
import { mockVendors } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState({
    name: 'John Mkhonta',
    email: 'john.mkhonta@email.com',
    phone: '+268 2400 1234',
    userType: 'customer',
    location: 'Mbabane Industrial Area',
    isVendor: false,
    businessProfile: null,
  });
  const [isOnline, setIsOnline] = useState(true);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [newStockItem, setNewStockItem] = useState({ item: '', price: '', unit: '', available: true });

  useEffect(() => {
    // Check if user has business profile
    const businessProfile = mockVendors.find(v => v.ownerName === userProfile.name);
    if (businessProfile) {
      setUserProfile(prev => ({ ...prev, businessProfile, isVendor: true }));
    }
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.navigate('VendorLogin') }
      ]
    );
  };

  const handleSwitchToVendor = () => {
    if (!userProfile.isVendor) {
      navigation.navigate('AddVendor');
    }
  };

  const handleUpdateStock = () => {
    if (!newStockItem.item || !newStockItem.price) {
      Alert.alert('Error', 'Please fill in item name and price');
      return;
    }

    Alert.alert(
      'Stock Updated',
      `${newStockItem.item} has been added to your stock`,
      [
        {
          text: 'OK',
          onPress: () => {
            setStockModalVisible(false);
            setNewStockItem({ item: '', price: '', unit: '', available: true });
          }
        }
      ]
    );
  };

  const handleToggleAvailability = (itemIndex) => {
    Alert.alert(
      'Toggle Availability',
      'Mark this item as unavailable?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => console.log('Toggle availability') }
      ]
    );
  };

  const renderCustomerProfile = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Account Information</Text>
          <List.Item
            title="Full Name"
            description={userProfile.name}
            left={() => <List.Icon icon="account" />}
          />
          <List.Item
            title="Email"
            description={userProfile.email}
            left={() => <List.Icon icon="email" />}
          />
          <List.Item
            title="Phone"
            description={userProfile.phone}
            left={() => <List.Icon icon="phone" />}
          />
          <List.Item
            title="Location"
            description={userProfile.location}
            left={() => <List.Icon icon="map-marker" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button
            mode="outlined"
            onPress={handleSwitchToVendor}
            style={styles.actionButton}
            icon="store"
          >
            Become a Vendor
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('BulkGroupsScreen')}
            style={styles.actionButton}
            icon="group"
          >
            Join Bulk Groups
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Support', 'Contact support for help')}
            style={styles.actionButton}
            icon="help-circle"
          >
            Get Support
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderVendorProfile = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.vendorHeader}>
            <Avatar.Image
              size={80}
              source={{ uri: userProfile.businessProfile.profileImage }}
              style={styles.businessAvatar}
            />
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{userProfile.businessProfile.name}</Text>
              <Text style={styles.businessType}>{userProfile.businessProfile.type}</Text>
              <View style={styles.businessStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>{userProfile.businessProfile.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={16} color={theme.colors.primary} />
                  <Text style={styles.statText}>{userProfile.businessProfile.reviewCount} reviews</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.onlineStatus}>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              color={theme.colors.primary}
            />
            <Text style={styles.onlineText}>
              {isOnline ? 'Online - Accepting Orders' : 'Offline - Not Accepting Orders'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Business Information</Text>
          <List.Item
            title="Business Name"
            description={userProfile.businessProfile.name}
            left={() => <List.Icon icon="store" />}
          />
          <List.Item
            title="Category"
            description={userProfile.businessProfile.category}
            left={() => <List.Icon icon="tag" />}
          />
          <List.Item
            title="Location"
            description={userProfile.businessProfile.location.area}
            left={() => <List.Icon icon="map-marker" />}
          />
          <List.Item
            title="Delivery Radius"
            description={`${userProfile.businessProfile.deliveryRadius} km`}
            left={() => <List.Icon icon="car" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.stockHeader}>
            <Text style={styles.cardTitle}>Current Stock</Text>
            <Button
              mode="contained"
              onPress={() => setStockModalVisible(true)}
              compact
              icon="plus"
            >
              Add Item
            </Button>
          </View>

          {userProfile.businessProfile.stock.map((item, index) => (
            <View key={index} style={styles.stockItem}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockName}>{item.item}</Text>
                <Text style={styles.stockPrice}>E{item.price} / {item.unit}</Text>
              </View>
              <Chip
                style={[
                  styles.availabilityChip,
                  { backgroundColor: item.available ? theme.colors.success : theme.colors.error }
                ]}
                textStyle={styles.availabilityText}
                onPress={() => handleToggleAvailability(index)}
              >
                {item.available ? 'Available' : 'Out of Stock'}
              </Chip>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Business Actions</Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('BulkGroups')}
            style={styles.actionButton}
            icon="people"
          >
            Manage Bulk Groups
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Analytics', 'View your business analytics')}
            style={styles.actionButton}
            icon="chart-line"
          >
            View Analytics
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Orders', 'View your orders')}
            style={styles.actionButton}
            icon="receipt"
          >
            Manage Orders
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account and business profile
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={80}
                label={userProfile.name.split(' ').map(n => n[0]).join('')}
                style={styles.profileAvatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileType}>
                  {userProfile.isVendor ? 'Vendor' : 'Customer'}
                </Text>
                <Text style={styles.profileLocation}>{userProfile.location}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {userProfile.isVendor ? renderVendorProfile() : renderCustomerProfile()}

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Settings</Text>
            <List.Item
              title="Notifications"
              description="Manage your notification preferences"
              left={() => <List.Icon icon="bell" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('Notifications', 'Notification settings')}
            />
            <List.Item
              title="Privacy"
              description="Manage your privacy settings"
              left={() => <List.Icon icon="shield-account" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('Privacy', 'Privacy settings')}
            />
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={() => <List.Icon icon="help-circle" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('Support', 'Help and support')}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor={theme.colors.error}
              icon="logout"
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Modal
          visible={stockModalVisible}
          onDismiss={() => setStockModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add Stock Item</Text>

          <TextInput
            label="Item Name"
            value={newStockItem.item}
            onChangeText={(value) => setNewStockItem(prev => ({ ...prev, item: value }))}
            mode="outlined"
            style={styles.modalInput}
          />

          <TextInput
            label="Price"
            value={newStockItem.price}
            onChangeText={(value) => setNewStockItem(prev => ({ ...prev, price: value }))}
            mode="outlined"
            keyboardType="numeric"
            style={styles.modalInput}
          />

          <TextInput
            label="Unit (e.g., per kg, each)"
            value={newStockItem.unit}
            onChangeText={(value) => setNewStockItem(prev => ({ ...prev, unit: value }))}
            mode="outlined"
            style={styles.modalInput}
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setStockModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateStock}
              style={styles.modalButton}
            >
              Add Item
            </Button>
          </View>
        </Modal>
      </Portal>

      {userProfile.isVendor && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setStockModalVisible(true)}
          label="Add Stock"
        />
      )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    backgroundColor: theme.colors.primary,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileType: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    color: theme.colors.primary,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessAvatar: {
    marginRight: 16,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  businessStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginLeft: 4,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
  },
  onlineText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  stockPrice: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  availabilityChip: {
    height: 28,
  },
  availabilityText: {
    color: 'white',
    fontSize: 10,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 60,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
});
