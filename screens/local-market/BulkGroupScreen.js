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
  Badge,
  Button,
  Card,
  Chip,
  FAB,
  Text,
} from 'react-native-paper';
import { mockBulkGroups, mockSuppliers } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function BulkGroupsScreen({ navigation }) {
  const [bulkGroups, setBulkGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedTab, setSelectedTab] = useState('available');

  useEffect(() => {
    setBulkGroups(mockBulkGroups);
    // Simulate user's joined groups
    setUserGroups([mockBulkGroups[0]]);
  }, []);

  const handleJoinGroup = (group) => {
    Alert.alert(
      'Join Bulk Group',
      `Join "${group.name}"?\n\nBenefits:\n${group.benefits.join('\n')}\n\nRequirements: ${group.requirements}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Group',
          onPress: () => {
            Alert.alert('Success!', 'You have successfully joined the bulk buying group. You will receive notifications about upcoming orders.');
          }
        }
      ]
    );
  };

  const handleCreateGroup = () => {
    Alert.alert(
      'Create Bulk Group',
      'Start your own bulk buying group to get better prices with other vendors.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Group', onPress: () => console.log('Create new group') }
      ]
    );
  };

  const handleViewSuppliers = () => {
    Alert.alert(
      'Suppliers',
      'View available suppliers for bulk orders.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Suppliers', onPress: () => console.log('View suppliers') }
      ]
    );
  };

  const renderGroupCard = ({ item, isUserGroup = false }) => (
    <Card style={styles.groupCard}>
      <Card.Content>
        <View style={styles.groupHeader}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupCategory}>{item.category}</Text>
            <View style={styles.groupStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color={theme.colors.primary} />
                <Text style={styles.statText}>{item.memberCount} members</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cash" size={16} color={theme.colors.success} />
                <Text style={styles.statText}>{item.savings}% savings</Text>
              </View>
            </View>
          </View>
          {isUserGroup && (
            <Badge style={styles.joinedBadge}>Joined</Badge>
          )}
        </View>

        <Text style={styles.groupDescription}>
          {item.description}
        </Text>

        <View style={styles.groupDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Area: {item.area}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Next Order: {item.nextOrderDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>Min Order: E{item.minOrder}</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Benefits:</Text>
          <View style={styles.benefitsList}>
            {item.benefits.map((benefit, index) => (
              <Chip key={index} style={styles.benefitChip} compact>
                {benefit}
              </Chip>
            ))}
          </View>
        </View>

        {isUserGroup ? (
          <View style={styles.groupActions}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Group Details', 'View group details and manage orders')}
              style={styles.actionButton}
            >
              Manage Group
            </Button>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Place Order', 'Place order for next bulk purchase')}
              style={styles.actionButton}
            >
              Place Order
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={() => handleJoinGroup(item)}
            style={styles.joinButton}
          >
            Join Group
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  const renderSupplierCard = ({ item }) => (
    <Card style={styles.supplierCard}>
      <Card.Content>
        <View style={styles.supplierHeader}>
          <Text style={styles.supplierName}>{item.name}</Text>
          <Chip style={styles.supplierType}>{item.type}</Chip>
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

        <Button
          mode="outlined"
          onPress={() => Alert.alert('Contact Supplier', `Contact ${item.name} for bulk orders`)}
          style={styles.contactButton}
        >
          Contact Supplier
        </Button>
      </Card.Content>
    </Card>
  );

  const renderTabContent = () => {
    if (selectedTab === 'available') {
      return (
        <FlatList
          data={bulkGroups}
          renderItem={({ item }) => renderGroupCard({ item })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    } else if (selectedTab === 'my-groups') {
      return (
        <View>
          {userGroups.length > 0 ? (
            <FlatList
              data={userGroups}
              renderItem={({ item }) => renderGroupCard({ item, isUserGroup: true })}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyTitle}>No Groups Joined</Text>
              <Text style={styles.emptySubtitle}>
                Join bulk buying groups to get better prices and connect with other vendors
              </Text>
              <Button
                mode="contained"
                onPress={() => setSelectedTab('available')}
                style={styles.emptyActionButton}
              >
                Browse Groups
              </Button>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <FlatList
          data={mockSuppliers}
          renderItem={renderSupplierCard}
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
        <Text style={styles.headerTitle}>Bulk Buying Groups</Text>
        <Text style={styles.headerSubtitle}>
          Join groups to get better prices on bulk orders
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'available' && styles.activeTab]}
            onPress={() => setSelectedTab('available')}
          >
            <Text style={[styles.tabText, selectedTab === 'available' && styles.activeTabText]}>
              Available Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'my-groups' && styles.activeTab]}
            onPress={() => setSelectedTab('my-groups')}
          >
            <Text style={[styles.tabText, selectedTab === 'my-groups' && styles.activeTabText]}>
              My Groups ({userGroups.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'suppliers' && styles.activeTab]}
            onPress={() => setSelectedTab('suppliers')}
          >
            <Text style={[styles.tabText, selectedTab === 'suppliers' && styles.activeTabText]}>
              Suppliers
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {renderTabContent()}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateGroup}
        label="Create Group"
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
    backgroundColor: 'white',
    paddingVertical: 12,
    elevation: 2,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.placeholder,
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  groupCard: {
    marginBottom: 16,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupCategory: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  groupStats: {
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
  joinedBadge: {
    backgroundColor: theme.colors.success,
    color: 'white',
  },
  groupDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  groupDetails: {
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
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: theme.colors.surface,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  joinButton: {
    marginTop: 8,
  },
  supplierCard: {
    marginBottom: 16,
    elevation: 4,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  supplierType: {
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
  contactButton: {
    marginTop: 8,
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
