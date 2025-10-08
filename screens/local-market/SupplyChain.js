import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Badge,
    Button,
    Card,
    Chip,
    FAB,
    Text,
} from 'react-native-paper';
import { mockSuppliers } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function SupplyChainScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);

  useEffect(() => {
    setSuppliers(mockSuppliers);
    // Mock bulk orders data
    setBulkOrders([
      {
        id: '1',
        supplier: 'Swazi Fresh Produce Co.',
        group: 'Mbabane Vegetable Collective',
        totalAmount: 2500,
        status: 'pending',
        orderDate: '2024-01-15',
        deliveryDate: '2024-01-20',
        items: [
          { name: 'Tomatoes', quantity: 100, unit: 'kg', price: 15 },
          { name: 'Onions', quantity: 80, unit: 'kg', price: 12 },
          { name: 'Carrots', quantity: 60, unit: 'kg', price: 18 }
        ]
      },
      {
        id: '2',
        supplier: 'Royal Swazi Foods',
        group: 'Manzini Food Suppliers',
        totalAmount: 1800,
        status: 'confirmed',
        orderDate: '2024-01-18',
        deliveryDate: '2024-01-25',
        items: [
          { name: 'Traditional Stew Mix', quantity: 50, unit: 'packets', price: 25 },
          { name: 'Fresh Bread', quantity: 100, unit: 'loaves', price: 8 }
        ]
      }
    ]);
    
    // Mock vendor requests
    setVendorRequests([
      {
        id: '1',
        vendorName: 'New Vendor ABC',
        category: 'Vegetables',
        requestType: 'supplier_partnership',
        status: 'pending',
        requestDate: '2024-01-14',
        description: 'Requesting partnership for bulk vegetable supply'
      },
      {
        id: '2',
        vendorName: 'Local Craft Shop',
        category: 'Handicrafts',
        requestType: 'bulk_group_join',
        status: 'approved',
        requestDate: '2024-01-12',
        description: 'Requesting to join handicraft bulk buying group'
      }
    ]);
  }, []);

  const handleSupplierContact = (supplier) => {
    Alert.alert(
      'Contact Supplier',
      `Contact ${supplier.name}?\n\nPhone: ${supplier.contact}\nLocation: ${supplier.location}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call supplier') },
        { text: 'Email', onPress: () => console.log('Email supplier') }
      ]
    );
  };

  const handleBulkOrderAction = (order, action) => {
    switch (action) {
      case 'approve':
        Alert.alert(
          'Approve Order',
          `Approve bulk order for ${order.supplier}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', onPress: () => console.log('Approve order') }
          ]
        );
        break;
      case 'reject':
        Alert.alert(
          'Reject Order',
          `Reject bulk order for ${order.supplier}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reject', onPress: () => console.log('Reject order') }
          ]
        );
        break;
      case 'track':
        Alert.alert(
          'Track Order',
          `Order #${order.id}\nStatus: ${order.status}\nDelivery Date: ${order.deliveryDate}`,
          [{ text: 'OK' }]
        );
        break;
    }
  };

  const handleVendorRequestAction = (request, action) => {
    switch (action) {
      case 'approve':
        Alert.alert(
          'Approve Request',
          `Approve ${request.requestType} request from ${request.vendorName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', onPress: () => console.log('Approve request') }
          ]
        );
        break;
      case 'reject':
        Alert.alert(
          'Reject Request',
          `Reject ${request.requestType} request from ${request.vendorName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reject', onPress: () => console.log('Reject request') }
          ]
        );
        break;
    }
  };

  const renderSupplierCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.supplierHeader}>
          <View style={styles.supplierInfo}>
            <Text style={styles.supplierName}>{item.name}</Text>
            <Text style={styles.supplierType}>{item.type} • {item.category}</Text>
          </View>
          <Chip style={styles.supplierChip}>{item.type}</Chip>
        </View>
        
        <Text style={styles.supplierDescription}>
          {item.description}
        </Text>

        <View style={styles.supplierDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="phone-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>{item.contact}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Min Order: E{item.minOrder}</Text>
          </View>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.productsTitle}>Products:</Text>
          <View style={styles.productsList}>
            {item.products.map((product, index) => (
              <Chip key={index} style={styles.productChip} compact>
                {product}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.supplierActions}>
          <Button 
            mode="outlined" 
            onPress={() => handleSupplierContact(item)}
            style={styles.actionButton}
            icon="phone"
          >
            Contact
          </Button>
          <Button 
            mode="contained" 
            onPress={() => Alert.alert('Place Order', `Place bulk order with ${item.name}`)}
            style={styles.actionButton}
            icon="shopping-cart"
          >
            Order
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderBulkOrderCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Order #{item.id}</Text>
            <Text style={styles.orderSupplier}>{item.supplier}</Text>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getOrderStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Badge>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Group: {item.group}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Order Date: {item.orderDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="truck" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Delivery: {item.deliveryDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Total: E{item.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {item.items.map((orderItem, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemQuantity}>{orderItem.quantity} {orderItem.unit}</Text>
              <Text style={styles.itemPrice}>E{orderItem.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderActions}>
          {item.status === 'pending' && (
            <>
              <Button 
                mode="outlined" 
                onPress={() => handleBulkOrderAction(item, 'reject')}
                style={styles.actionButton}
                icon="close"
                buttonColor={theme.colors.error}
                textColor="white"
              >
                Reject
              </Button>
              <Button 
                mode="contained" 
                onPress={() => handleBulkOrderAction(item, 'approve')}
                style={styles.actionButton}
                icon="check"
              >
                Approve
              </Button>
            </>
          )}
          {item.status === 'confirmed' && (
            <Button 
              mode="contained" 
              onPress={() => handleBulkOrderAction(item, 'track')}
              style={styles.actionButton}
              icon="map"
            >
              Track Order
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderVendorRequestCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>{item.vendorName}</Text>
            <Text style={styles.requestType}>{item.requestType.replace('_', ' ')}</Text>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getRequestStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Badge>
        </View>

        <Text style={styles.requestDescription}>
          {item.description}
        </Text>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="tag" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Category: {item.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Request Date: {item.requestDate}</Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <View style={styles.requestActions}>
            <Button 
              mode="outlined" 
              onPress={() => handleVendorRequestAction(item, 'reject')}
              style={styles.actionButton}
              icon="close"
              buttonColor={theme.colors.error}
              textColor="white"
            >
              Reject
            </Button>
            <Button 
              mode="contained" 
              onPress={() => handleVendorRequestAction(item, 'approve')}
              style={styles.actionButton}
              icon="check"
            >
              Approve
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.primary;
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'approved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'suppliers':
        return (
          <FlatList
            data={suppliers}
            renderItem={renderSupplierCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'orders':
        return (
          <FlatList
            data={bulkOrders}
            renderItem={renderBulkOrderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'requests':
        return (
          <FlatList
            data={vendorRequests}
            renderItem={renderVendorRequestCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supply Chain</Text>
        <Text style={styles.headerSubtitle}>
          Manage suppliers, bulk orders, and vendor partnerships
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'suppliers' && styles.activeTab]}
          onPress={() => setSelectedTab('suppliers')}
        >
          <Ionicons 
            name="business-outline" 
            size={20} 
            color={selectedTab === 'suppliers' ? 'white' : theme.colors.placeholder} 
          />
          <Text style={[styles.tabText, selectedTab === 'suppliers' && styles.activeTabText]}>
            Suppliers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'orders' && styles.activeTab]}
          onPress={() => setSelectedTab('orders')}
        >
          <Ionicons 
            name="receipt-outline" 
            size={20} 
            color={selectedTab === 'orders' ? 'white' : theme.colors.placeholder} 
          />
          <Text style={[styles.tabText, selectedTab === 'orders' && styles.activeTabText]}>
            Bulk Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'requests' && styles.activeTab]}
          onPress={() => setSelectedTab('requests')}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={selectedTab === 'requests' ? 'white' : theme.colors.placeholder} 
          />
          <Text style={[styles.tabText, selectedTab === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('New Partnership', 'Add new supplier or vendor partnership')}
        label="Add Partnership"
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
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  supplierType: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  supplierChip: {
    backgroundColor: theme.colors.accent,
    color: 'white',
  },
  supplierDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  supplierDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginLeft: 8,
  },
  productsContainer: {
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: theme.colors.surface,
  },
  supplierActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderSupplier: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  statusBadge: {
    color: 'white',
    fontSize: 10,
  },
  orderDetails: {
    marginBottom: 12,
  },
  itemsContainer: {
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
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requestType: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  requestDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  requestDetails: {
    marginBottom: 16,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
