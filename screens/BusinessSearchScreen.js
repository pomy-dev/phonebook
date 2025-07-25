import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllCompanies, fetchAllCompaniesOffline } from "../service/getApi";

const { width } = Dimensions.get("window");

export default function BusinessScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredCategory, setFeaturedCategory] = useState("Emergency");
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    {
      name: "Logistics",
      icon: "cube-outline",
      color: "#4C6EF5",
    },
    {
      name: "Government",
      icon: "business-outline",
      color: "#12B886",
    },
    {
      name: "Healthcare",
      icon: "medical-outline",
      color: "#FA5252",
    },
    {
      name: "Financial",
      icon: "cash-outline",
      color: "#228BE6",
    },
    {
      name: "Education",
      icon: "school-outline",
      color: "#FD7E14",
    },
    {
      name: "Retail",
      icon: "cart-outline",
      color: "#7950F2",
    },
    {
      name: "Insurance",
      icon: "shield-checkmark-outline",
      color: "#20C997",
    },
    {
      name: "Tourism",
      icon: "airplane-outline",
      color: "#E64980",
    },
    {
      name: "Energy & Water",
      icon: "flash-outline",
      color: "#15AABF",
    },
    {
      name: "Manufacturing",
      icon: "construct-outline",
      color: "#FAB005",
    },
    {
      name: "Motoring",
      icon: "car-outline",
      color: "#BE4BDB",
    },
    {
      name: "NGO",
      icon: "people-outline",
      color: "#40C057",
    },
    {
      name: "Oil Industry",
      icon: "water-outline",
      color: "#FD7E14",
    },
    {
      name: "Professional Services",
      icon: "briefcase-outline",
      color: "#4C6EF5",
    },
    {
      name: "Estate",
      icon: "home-outline",
      color: "#FA5252",
    },
    {
      name: "Transport",
      icon: "bus-outline",
      color: "#15AABF",
    },
    {
      name: "Construction",
      icon: "hammer-outline",
      color: "#FAB005",
    },
    {
      name: "Telecommunication",
      icon: "call-outline",
      color: "#4C6EF5",
    },
    {
      name: "Agriculture",
      icon: "paw-outline",
      color: "#40C057",
    },
    {
      name: "Information Technology",
      icon: "laptop-outline",
      color: "#15AABF",
    },
  ];

  // Featured categories for the top section
  const featuredCategories = [
    {
      name: "Emergency",
      icon: "bandage-outline",
      image:
        "https://images.unsplash.com/photo-1565514020179-026b62f2c4a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Healthcare",
      icon: "medical-outline",
      image:
        "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Government",
      icon: "business-outline",
      image:
        "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Education",
      icon: "school-outline",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  const handleCategoryPress = (categoryObj) => {
    const category = categoryObj.name;
    navigation.navigate("Countries", {
      screen: "BusinessList",
      params: { category },
    });
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const companyData = await fetchAllCompanies();
      setBusinesses(companyData);
      Alert.alert("Success", "Business listings refreshed successfully");
    } catch (err) {
      console.log(err.message);
      Alert.alert("Error", "Failed to refresh business listings");
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = async (query = searchQuery) => {
    data = await fetchAllCompaniesOffline();
    const filtered = data.filter((business) => {
      const matchesSearch =
        business.company_name
          .toLowerCase()
          .includes(query.toLowerCase().trim()) ||
        business.company_type
          .toLowerCase()
          .includes(query.toLowerCase().trim()) ||
        business.address.toLowerCase().includes(query.toLowerCase().trim());

      return matchesSearch;
    });

    setFilteredBusinesses(filtered);
  };


    // Check if a business is in favorites
  const isInFavorites = (businessId) => {
    return favorites.some((fav) => fav._id === businessId);
  };

  // Toggle favorite status
  const toggleFavorite = async (business) => {
    try {
      let newFavorites = [...favorites];

      if (isInFavorites(business._id)) {
        // Remove from favorites
        newFavorites = newFavorites.filter((fav) => fav._id !== business._id);
      } else {
        // Add to favorites
        newFavorites.push(business);
      }

      // Update state
      setFavorites(newFavorites);

      // Save to AsyncStorage
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));

      // Show feedback to user
      Alert.alert(
        isInFavorites(business._id)
          ? "Removed from Favorites"
          : "Added to Favorites",
        isInFavorites(business._id)
          ? `${business.company_name} has been removed from your favorites.`
          : `${business.company_name} has been added to your favorites.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.log("Error updating favorites:", error);
      Alert.alert("Error", "Could not update favorites. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const companyData = await fetchAllCompaniesOffline();
      setBusinesses(companyData);

      if (companyData.length > 0) {
        const filteredArray = companyData.filter(
          (company) =>
            company.company_type &&
            company.company_type.toLowerCase() ===
              featuredCategory.toLowerCase()
        );

        const filtered = filteredArray.filter((business) =>
          [
            business.company_name,
            business.address,
            business.description,
            ...(Array.isArray(business.company_tags)
              ? business.company_tags.join(", ")
              : []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())
        );

        setFilteredBusinesses(filtered);
      }
    };

    fetchData();
  }, [searchQuery, featuredCategory]);

  useEffect(() => {
    filterBusinesses(searchQuery)
  }, [searchQuery]);

  const hide = searchQuery.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>Directory</Text>
        <TouchableOpacity
          style={styles.alphabetButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#003366" />
          ) : (
            <Ionicons name="refresh-outline" size={20} color="#003366" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#AAAAAA"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search categories"
            style={styles.searchInput}
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
          <View style={styles.businessesContainer}>
                     <Text style={styles.businessesTitle}>Businesses</Text>
                     <View style={styles.businessesList}>
                       {filteredBusinesses.length > 0 ? (
                         filteredBusinesses.map((item) => (
                           <TouchableOpacity
                             key={item._id}
                             style={styles.favoriteCard}
                             activeOpacity={0.8}
                             onPress={() => handleBusinessPress(item)}
                           >
                             <View style={styles.favoriteHeader}>
                               <View style={styles.businessImageContainer}>
                                 {item.logo ? (
                                   <Image
                                     source={{ uri: item.logo }}
                                     style={styles.businessImage}
                                     resizeMode="cover"
                                   />
                                 ) : (
                                   <View style={styles.businessInitialContainer}>
                                     <Text style={styles.businessInitial}>
                                       {item.company_name.charAt(0)}
                                     </Text>
                                   </View>
                                 )}
                               </View>
           
                               <View style={styles.businessInfo}>
                                 <Text
                                   style={styles.businessName}
                                   numberOfLines={1}
                                   ellipsizeMode="tail"
                                 >
                                   {item.company_name}
                                 </Text>
                                 <Text
                                   style={styles.businessCategory}
                                   numberOfLines={1}
                                   ellipsizeMode="tail"
                                 >
                                   {item.company_type}
                                 </Text>
                                 <Text
                                   style={styles.businessAddress}
                                   numberOfLines={1}
                                   ellipsizeMode="tail"
                                 >
                                   {item.address}
                                 </Text>
                               </View>
           
                               {/* Favorite heart icon */}
                               <TouchableOpacity
                                 style={styles.favoriteButton}
                                 onPress={(e) => {
                                   e.stopPropagation();
                                   toggleFavorite(item);
                                 }}
                                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                               >
                                 <Ionicons
                                   name={
                                     isInFavorites(item._id) ? "heart" : "heart-outline"
                                   }
                                   size={22}
                                   color={isInFavorites(item._id) ? "#003366" : "#AAAAAA"}
                                 />
                               </TouchableOpacity>
                             </View>
           
                             <View style={styles.divider} />
           
                             <View style={styles.actionButtons}>
                               <TouchableOpacity
                                 style={styles.actionButton}
                                 onPress={(e) => {
                                   e.stopPropagation();
                                   handleCall(item.phone);
                                 }}
                               >
                                 <Ionicons name="call-outline" size={18} color="#003366" />
                                 <Text style={styles.actionButtonText}>Call</Text>
                               </TouchableOpacity>
           
                               {item.phone &&
                                 item.phone.some((p) => p.phone_type == "whatsapp") && (
                                   <TouchableOpacity
                                     style={styles.actionButton}
                                     onPress={(e) => {
                                       e.stopPropagation();
                                       handleWhatsapp(item.phone);
                                     }}
                                   >
                                     <Ionicons
                                       name="logo-whatsapp"
                                       size={18}
                                       color="#25D366"
                                     />
                                     <Text style={styles.actionButtonText}>WhatsApp</Text>
                                   </TouchableOpacity>
                                 )}
           
                               <TouchableOpacity
                                 style={styles.actionButton}
                                 onPress={(e) => {
                                   e.stopPropagation();
                                   connectEmail(item.email);
                                 }}
                               >
                                 <Ionicons name="mail-outline" size={18} color="#FF9500" />
                                 <Text style={styles.actionButtonText}>Email</Text>
                               </TouchableOpacity>
           
                               <TouchableOpacity
                                 style={styles.actionButton}
                                 onPress={(e) => {
                                   e.stopPropagation();
                                   findLocation(item.address);
                                 }}
                               >
                                 <Ionicons
                                   name="location-outline"
                                   size={18}
                                   color="#5856D6"
                                 />
                                 <Text style={styles.actionButtonText}>Map</Text>
                               </TouchableOpacity>
                             </View>
           
                             {item.subscription_type.toLowerCase() !== "bronze" && (
                               <TouchableOpacity
                                 style={styles.viewDetailsButton}
                                 onPress={() =>
                                   navigation.navigate("BusinessDetail", {
                                     business: item,
                                   })
                                 }
                               >
                                 <Text style={styles.viewDetailsText}>View Details</Text>
                                 <Ionicons
                                   name="chevron-forward"
                                   size={16}
                                   color="#003366"
                                 />
                               </TouchableOpacity>
                             )}
                           </TouchableOpacity>
                         ))
                       ) : (
                         <View style={styles.noResultsContainer}>
                           <Ionicons name="search" size={48} color="#DDDDDD" />
                           <Text style={styles.noResultsText}>No businesses found</Text>
                           <Text style={styles.noResultsSubtext}>
                             Try a different search or category
                           </Text>
                         </View>
                       )}
                     </View>
                   </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingTop: 30,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -0.5,
  },
  alphabetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alphabetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 5,
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
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "500",
  },
  featuredListContent: {
    paddingLeft: 24,
    paddingRight: 16,
  },
  featuredItem: {
    width: 120,
    marginRight: 16,
  },
  featuredImageContainer: {
    width: 120,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 51, 102, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  allCategoriesContainer: {
    paddingBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: "#999999",
  },
  chevronContainer: {
    width: 30,
    alignItems: "flex-end",
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
 businessesContainer: {
    paddingHorizontal: 24,
  },
  businessesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  businessesList: {},
  // New card styles that match the FavoritesScreen
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
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
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  businessInitial: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  businessInfo: {
    flex: 1,
    paddingRight: 30, // Make room for the heart icon
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 13,
    color: "#999999",
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: "#333333",
    marginLeft: 6,
    fontWeight: "500",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginRight: 4,
  },
  // Keep existing styles
  businessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  bronzeBusinessCard: {
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  businessCardContent: {
    flexDirection: "row",
    padding: 16,
  },
  businessDetails: {
    flex: 1,
  },
  businessActions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  callChevron: {
    marginLeft: 2,
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
    flexWrap: "wrap",
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
});
