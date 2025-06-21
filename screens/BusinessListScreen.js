"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Image,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { fetchAllCompaniesOffline } from "../service/getApi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import connectWhatsApp from "../components/connectWhatsApp"
import connectEmail from "../components/connectEmail"
import findLocation from "../components/findLocation"

const { width } = Dimensions.get("window")
export default function BusinessList({ route, navigation }) {
  const { category } = route.params
  const [businesses, setBusinesses] = useState([])
  const [filteredBusinesses, setFilteredBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false)
  const [selectedBronzeBusiness, setSelectedBronzeBusiness] = useState(null)
  const [favorites, setFavorites] = useState([])

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Check if a business is in favorites
  const isInFavorites = (businessId) => {
    return favorites.some(fav => fav._id === businessId);
  };

  // Toggle favorite status
  const toggleFavorite = async (business, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      let newFavorites = [...favorites];

      if (isInFavorites(business._id)) {
        // Remove from favorites
        newFavorites = newFavorites.filter(fav => fav._id !== business._id);
      } else {
        // Add to favorites
        newFavorites.push(business);
      }

      // Update state
      setFavorites(newFavorites);

      // Save to AsyncStorage
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.log('Error updating favorites:', error);
      Alert.alert('Error', 'Could not update favorites. Please try again.');
    }
  };

  // Mock data - in a real app, this would come from your API based on the category
  useEffect(async () => {
    console.log(category)
    // Simulate API loading
    setLoading(true);
    const companyData = await fetchAllCompaniesOffline();

    setBusinesses(companyData)
    setLoading(false)
  }, [category])

  useEffect(() => {
    if (businesses.length > 0) {
      const filteredArray = [];

      // Loop through the company data and categorize
      businesses.forEach((company) => {
        if (company.company_type === category) {
          filteredArray.push(company);
        }
      });
      const filtered = filteredArray.filter(
        (business) =>
          business.company_name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          business.address.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (business.description && business.description.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          (business.company_tags && Array.isArray(business.company_tags) && business.company_tags.join(", ").toLowerCase().includes(searchQuery.toLowerCase().trim()))
      )
      setFilteredBusinesses(filtered)
    }
  }, [searchQuery, businesses])

  const handleCall = (phoneNumbers, e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!phoneNumbers || phoneNumbers.length === 0) {
      Alert.alert('No Phone Number', 'This business has no phone number listed.');
      return;
    }

    if (phoneNumbers.length === 1) {
      // If there's only one phone number, ask for confirmation
      Alert.alert("Call Business", `Would you like to call ${phoneNumbers[0].number}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${phoneNumbers[0].number}`) },
      ])
    } else if (phoneNumbers.length > 1) {
      // If there are multiple phone numbers, show a selection dialog with cancel option
      const options = phoneNumbers.map((phone) => ({
        text: `${phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)}: ${phone.number}`,
        onPress: () => Linking.openURL(`tel:${phone.number}`),
      }))

      // Add cancel option
      options.push({ text: "Cancel", style: "cancel" })

      Alert.alert("Select Phone Number", "Choose a number to call", options)
    }
  }

  const handleWhatsapp = (phones, e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!phones || phones.length === 0) {
      Alert.alert('No WhatsApp', 'This business has no WhatsApp number listed.');
      return;
    }


    for (let i = 0; i < phones.length; i++) {
      if (phones[i].phone_type == "whatsapp") {
        connectWhatsApp(phones[i].number);
        return;
      } else {
        Alert.alert('No WhatsApp', 'This business has no WhatsApp number listed.');
      }
    }
  }

  const handleEmail = (email, e) => {
    if (e) {
      e.stopPropagation();
    }
    connectEmail(email);
  }

  const handleLocation = (address, e) => {
    if (e) {
      e.stopPropagation();
    }
    findLocation(address);
  }

  const handleBusinessPress = (business) => {
    if (business.subscription_type && business.subscription_type.toLowerCase() === "bronze") {
      // For Bronze businesses, show upgrade modal instead of navigating
      setSelectedBronzeBusiness(business)
      setUpgradeModalVisible(true)
    } else {
      // For Silver and Gold, navigate to business detail
      navigation.navigate("BusinessDetail", { business })
    }
  }

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.favoriteCard}
      activeOpacity={0.8}
      onPress={() => handleBusinessPress(item)}
    >
      <View style={styles.favoriteHeader}>
        <View style={styles.businessImageContainer}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.businessImage} resizeMode="cover" />
          ) : (
            <View style={styles.businessInitialContainer}>
              <Text style={styles.businessInitial}>{item.company_name.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View style={styles.businessInfo}>
          <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">{item.company_name}</Text>
          <Text style={styles.businessCategory} numberOfLines={1} ellipsizeMode="tail">{item.company_type}</Text>
          <Text style={styles.businessAddress} numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
        </View>

        {/* Favorite heart icon */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => toggleFavorite(item, e)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isInFavorites(item._id) ? "heart" : "heart-outline"}
            size={22}
            color={isInFavorites(item._id) ? "#003366" : "#AAAAAA"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => handleCall(item.phone, e)}
        >
          <Ionicons name="call-outline" size={18} color="#003366" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>

        {item.phone && item.phone.some(p => p.phone_type == 'whatsapp') && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleWhatsapp(item.phone);
            }}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => handleEmail(item.email, e)}
        >
          <Ionicons name="mail-outline" size={18} color="#FF9500" />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => handleLocation(item.address, e)}
        >
          <Ionicons name="location-outline" size={18} color="#5856D6" />
          <Text style={styles.actionButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      {(!item.subscription_type || item.subscription_type.toLowerCase() !== "bronze") && (
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate("BusinessDetail", { business: item })}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#003366" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Upgrade Modal for Bronze Businesses */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={upgradeModalVisible}
        onRequestClose={() => setUpgradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.upgradeModalContent}>
            <View style={styles.upgradeModalHeader}>
              <Text style={styles.upgradeModalTitle}>Business Information</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setUpgradeModalVisible(false)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {selectedBronzeBusiness && (
              <View style={styles.upgradeModalBody}>
                <View style={styles.businessBranding}>
                  <View style={styles.businessLogoContainer}>
                    {selectedBronzeBusiness.logo ? (
                      <Image
                        source={{ uri: selectedBronzeBusiness.logo }}
                        style={styles.businessLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.businessInitialContainer}>
                        <Text style={styles.businessInitial}>
                          {selectedBronzeBusiness.company_name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.upgradeBusinessName}>{selectedBronzeBusiness.company_name}</Text>
                  <Text style={styles.businessType}>{selectedBronzeBusiness.company_type}</Text>
                </View>

                <View style={styles.basicInfoContainer}>
                  {selectedBronzeBusiness.phone && selectedBronzeBusiness.phone.length > 0 && (
                    <TouchableOpacity
                      style={styles.basicInfoItem}
                      onPress={() => handleCall(selectedBronzeBusiness.phone)}
                    >
                      <Ionicons name="call-outline" size={20} color="#003366" />
                      <Text style={styles.basicInfoText}>{selectedBronzeBusiness.phone[0].number}</Text>
                    </TouchableOpacity>
                  )}

                  {selectedBronzeBusiness.phone &&
                    selectedBronzeBusiness.phone.some(p => p.phone_type === 'whatsApp') && (
                      <TouchableOpacity
                        style={styles.basicInfoItem}
                        onPress={() => handleWhatsapp(selectedBronzeBusiness.phone)}
                      >
                        <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                        <Text style={styles.basicInfoText}>
                          {selectedBronzeBusiness.phone.find(p => p.phone_type === 'whatsApp')?.number ||
                            selectedBronzeBusiness.phone[0].number}
                        </Text>
                      </TouchableOpacity>
                    )}

                  <TouchableOpacity
                    style={styles.basicInfoItem}
                    onPress={() => findLocation(selectedBronzeBusiness.address)}
                  >
                    <Ionicons name="location-outline" size={20} color="#5856D6" />
                    <Text style={styles.basicInfoText}>{selectedBronzeBusiness.address}</Text>
                  </TouchableOpacity>

                  {selectedBronzeBusiness.email && (
                    <TouchableOpacity
                      style={styles.basicInfoItem}
                      onPress={() => connectEmail(selectedBronzeBusiness.email)}
                    >
                      <Ionicons name="mail-outline" size={20} color="#FF9500" />
                      <Text style={styles.basicInfoText}>{selectedBronzeBusiness.email}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    onPress={() => {
                      setUpgradeModalVisible(false)
                      if (selectedBronzeBusiness.phone && selectedBronzeBusiness.phone.length > 0) {
                        handleCall(selectedBronzeBusiness.phone)
                      }
                    }}
                  >
                    <Ionicons name="call-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryActionText}>Call Business</Text>
                  </TouchableOpacity>

                  <View style={styles.secondaryActionsRow}>
                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        handleWhatsapp(selectedBronzeBusiness.phone)
                      }}
                    >
                      <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                      <Text style={styles.secondaryActionText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        connectEmail(selectedBronzeBusiness.email)
                      }}
                    >
                      <Ionicons name="mail-outline" size={20} color="#FF9500" />
                      <Text style={styles.secondaryActionText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        findLocation(selectedBronzeBusiness.address)
                      }}
                    >
                      <Ionicons name="location-outline" size={20} color="#5856D6" />
                      <Text style={styles.secondaryActionText}>Map</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>{category}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#AAAAAA" style={styles.searchIcon} />
          <TextInput
            placeholder="Search businesses"
            style={styles.searchInput}
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Ionicons name="business-outline" size={48} color="#DDDDDD" />
              <Text style={styles.noResultsText}>No businesses found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    fontWeight: "400",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#777777",
  },
  listContent: {
    padding: 24,
    paddingBottom: 30,
  },
  // New card styles that match the FavoritesScreen
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  businessImageContainer: {
    marginRight: 16,
  },
  businessImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  businessInitialContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  businessInfo: {
    flex: 1,
    paddingRight: 30, // Make room for the heart icon
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 13,
    color: '#999999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 6,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginRight: 4,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999999",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  upgradeModalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "80%",
  },
  upgradeModalHeader: {
    backgroundColor: "#003366",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  upgradeModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeModalBody: {
    padding: 20,
  },
  businessBranding: {
    alignItems: "center",
    marginBottom: 20,
  },
  businessLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  businessLogo: {
    width: 50,
    height: 50,
  },
  businessInitialContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  businessInitial: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  upgradeBusinessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
    textAlign: "center",
  },
  businessType: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  basicInfoContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  basicInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  basicInfoText: {
    fontSize: 15,
    color: "#333333",
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  actionButtonsContainer: {
    gap: 16,
  },
  primaryActionButton: {
    backgroundColor: "#003366",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  secondaryActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    backgroundColor: "#F8F8F8",
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
    marginTop: 4,
  },
})