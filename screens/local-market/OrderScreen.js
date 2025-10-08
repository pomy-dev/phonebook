import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  FAB,
  Text,
} from 'react-native-paper';
import { mockOrders, mockVendors } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.primary;
      case 'in_progress':
        return theme.colors.accent;
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'in_progress':
        return 'bicycle-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const handleOrderAction = (order, action) => {
    switch (action) {
      case 'track':
        Alert.alert(
          'Track Order',
          `Order #${order.id}\nStatus: ${order.status}\nEstimated delivery: ${order.estimatedDelivery || 'Not available'}`,
          [
            { text: 'OK' },
            { text: 'Call Vendor', onPress: () => console.log('Call vendor') }
          ]
        );
        break;
      case 'reorder':
        Alert.alert(
          'Reorder',
          `Reorder the same items from ${getVendorName(order.vendorId)}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reorder', onPress: () => console.log('Reorder') }
          ]
        );
        break;
      case 'rate':
        Alert.alert(
          'Rate Order',
          `How was your experience with ${getVendorName(order.vendorId)}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Rate', onPress: () => console.log('Rate order') }
          ]
        );
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Order',
          'Are you sure you want to cancel this order?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Cancel', onPress: () => console.log('Cancel order') }
          ]
        );
        break;
    }
  };

  const getVendorName = (vendorId) => {
    const vendor = mockVendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Unknown Vendor';
  };

  const getVendorImage = (vendorId) => {
    const vendor = mockVendors.find(v => v.id === vendorId);
    return vendor ? vendor.profileImage : 'https://via.placeholder.com/150';
  };

  const getActiveOrders = () => orders.filter(order =>
    ['pending', 'confirmed', 'in_progress'].includes(order.status)
  );

  const getCompletedOrders = () => orders.filter(order =>
    ['delivered', 'cancelled'].includes(order.status)
  );

  const renderOrderCard = ({ item }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View style={styles.vendorInfo}>
            <Avatar.Image
              size={40}
              source={{ uri: getVendorImage(item.vendorId) }}
              style={styles.vendorAvatar}
            />
            <View style={styles.vendorDetails}>
              <Text style={styles.vendorName}>{getVendorName(item.vendorId)}</Text>
              <Text style={styles.orderDate}>Order #{item.id} • {item.orderDate}</Text>
            </View>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getOrderStatusColor(item.status) }]}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {item.items.map((orderItem, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
              <Text style={styles.itemPrice}>E{orderItem.price}</Text>
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>E{item.total}</Text>
          </View>
          {item.deliveryAddress && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery to:</Text>
              <Text style={styles.summaryValue}>{item.deliveryAddress}</Text>
            </View>
          )}
          {item.estimatedDelivery && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated delivery:</Text>
              <Text style={styles.summaryValue}>{item.estimatedDelivery}</Text>
            </View>
          )}
        </View>

        <View style={styles.orderActions}>
          {item.status === 'in_progress' && (
            <Button
              mode="contained"
              onPress={() => handleOrderAction(item, 'track')}
              style={styles.actionButton}
              icon="map"
            >
              Track Order
            </Button>
          )}
          {item.status === 'delivered' && (
            <>
              <Button
                mode="outlined"
                onPress={() => handleOrderAction(item, 'reorder')}
                style={styles.actionButton}
                icon="refresh"
              >
                Reorder
              </Button>
              <Button
                mode="contained"
                onPress={() => handleOrderAction(item, 'rate')}
                style={styles.actionButton}
                icon="star"
              >
                Rate
              </Button>
            </>
          )}
          {item.status === 'pending' && (
            <Button
              mode="outlined"
              onPress={() => handleOrderAction(item, 'cancel')}
              style={styles.actionButton}
              icon="close"
              buttonColor={theme.colors.error}
              textColor="white"
            >
              Cancel
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = (type) => (
    <View style={styles.emptyState}>
      <Ionicons
        name={type === 'active' ? 'receipt-outline' : 'checkmark-done-outline'}
        size={64}
        color={theme.colors.disabled}
      />
      <Text style={styles.emptyTitle}>
        {type === 'active' ? 'No Active Orders' : 'No Completed Orders'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {type === 'active'
          ? 'Start ordering from local vendors to see your orders here'
          : 'Your completed orders will appear here'
        }
      </Text>
      {type === 'active' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Search')}
          style={styles.emptyActionButton}
        >
          Find Vendors
        </Button>
      )}
    </View>
  );

  const renderTabContent = () => {
    const activeOrders = getActiveOrders();
    const completedOrders = getCompletedOrders();

    if (selectedTab === 'active') {
      if (activeOrders.length === 0) {
        return renderEmptyState('active');
      }
      return (
        <FlatList
          data={activeOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      if (completedOrders.length === 0) {
        return renderEmptyState('completed');
      }
      return (
        <FlatList
          data={completedOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>
          Track your orders and delivery status
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
          onPress={() => setSelectedTab('active')}
        >
          <Ionicons
            name="receipt-outline"
            size={20}
            color={selectedTab === 'active' ? 'white' : theme.colors.placeholder}
          />
          <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
            Active ({getActiveOrders().length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
          onPress={() => setSelectedTab('completed')}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={20}
            color={selectedTab === 'completed' ? 'white' : theme.colors.placeholder}
          />
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
            Completed ({getCompletedOrders().length})
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('SearchScreen')}
        label="New Order"
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.placeholder,
    marginLeft: 8,
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: 16,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vendorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  vendorAvatar: {
    marginRight: 12,
  },
  vendorDetails: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  statusBadge: {
    color: 'white',
    fontSize: 10,
  },
  orderItems: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
    color: theme.colors.text,
  },
  itemQuantity: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  divider: {
    marginVertical: 16,
  },
  orderSummary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  emptyActionButton: {
    marginTop: 8,
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
