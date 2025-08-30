"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  RefreshControl
} from "react-native";
import { Icons } from "../utils/Icons";
import {
  fetchAllCompanies,
  fetchAllCompaniesOffline,
  fetchCompaniesWithAge,
} from "../service/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkNetworkConnectivity } from "../service/checkNetwork";
import CustomLoader from "../components/customLoader";
import eswatini from '../assets/pics/eswatini-state.jpg';
import { CustomToast } from "../utils/customToast";
import { CustomModal } from '../components/customModal'
import { useCallFunction } from '../components/customCallAlert'
import { handleLocation, handleBusinessPress, handleEmail, handleWhatsapp } from "../utils/callFunctions";

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [selectedBronzeBusiness, setSelectedBronzeBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { handleCall, AlertUI } = useCallFunction();

  const categories = ["All", "Government", "Emergency", "More..."];

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // const theme = await AsyncStorage.getItem("theme");
        // const notifications = await AsyncStorage.getItem("notifications");
        const storedFavorites = await AsyncStorage.getItem("favorites");
        // if (theme) setIsDarkMode(JSON.parse(theme));
        // if (notifications) setNotificationsEnabled(JSON.parse(notifications));
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log("Error loading favorites:", error);
      }
    };

    loadFavorites();

    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    // Clean up the listener
    return unsubscribe;
  }, [navigation]);

  // Check if a business is in favorites
  const isInFavorites = (businessId) => {
    return favorites.some((fav) => fav._id === businessId);
  };

  // Toggle favorite status
  const toggleFavorite = async (business) => {
    try {
      let newFavorites = [...favorites];

      if (isInFavorites(business._id)) {
        newFavorites = newFavorites.filter((fav) => fav._id !== business._id);
      } else {
        newFavorites.push(business);
      }

      setFavorites(newFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));

      CustomToast(
        isInFavorites(business._id) ? 'Removed from Favorites' : 'Added to Favorites',
        isInFavorites(business._id) ? `${business.company_name} has been removed from your favorites.` : `${business.company_name} has been added to your favorites.`
      )

    } catch (error) {
      console.log("Error updating favorites:", error);
      Alert.alert("Error", "Could not update favorites. Please try again.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const { ageInHours } = await fetchCompaniesWithAge();
      console.log("Data age (hours):", ageInHours);

      if (ageInHours < 1) {
        const ageInMinutes = Math.round(ageInHours * 60);
        setLastRefresh(`Last refresh was ${ageInMinutes} minutes ago`);
      } else {
        const roundedHours = Math.round(ageInHours * 100) / 100;
        setLastRefresh(`Last refresh was ${roundedHours} hours ago`);
      }

      if (ageInHours > 24) {
        handleRefresh();
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses(allBusinesses, activeCategory);
  }, [activeCategory, allBusinesses]);

  useEffect(() => {
    filterALLBs(searchQuery)
  }, [searchQuery]);

  const filterALLBs = async (query = searchQuery) => {
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

  const filterBusinesses = (
    data = allBusinesses,
    category = activeCategory,
    // query = searchQuery
  ) => {
    if (activeCategory !== "More...") {
      const filtered = data.filter((business) => {
        const matchesCategory =
          category === "All" ||
          business.company_type?.toLowerCase() === category.toLowerCase();
        return matchesCategory;
      });

      setFilteredBusinesses(filtered);
    } else {
      setActiveCategory("All")
      navigation.navigate("Countries", { screen: "BusinessesMain" });
    }
  };

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const companyData = await fetchAllCompaniesOffline();

      const featuredBusinesses = companyData.filter(
        (company) => company.subscription_type === "Gold"
      );
      const shuffledFeatured = featuredBusinesses.sort(
        () => Math.random() - 0.5
      );

      const nonGoldCompanies = companyData.filter(
        (company) => company.subscription_type !== "Gold"
      );

      setAllBusinesses(nonGoldCompanies);

      const shuffledNonGold = nonGoldCompanies.sort(() => Math.random() - 0.5);
      const regularBusinesses = shuffledNonGold.slice(0, 5);

      setFeaturedBusinesses(shuffledFeatured);
      setBusinesses(regularBusinesses);
      setFilteredBusinesses(regularBusinesses);
      filterBusinesses(nonGoldCompanies, activeCategory, searchQuery);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onBusinessPress = (business) => {
    handleBusinessPress(
      business,
      navigation,
      setSelectedBronzeBusiness,
      setUpgradeModalVisible
    );
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const isConnected = await checkNetworkConnectivity();

      if (isConnected) {
        try {
          const companyData = await fetchAllCompanies();
          const featuredBusinesses = companyData.filter(
            (company) => company.subscription_type === "Gold"
          );
          const nonGoldCompanies = companyData.filter(
            (company) => company.subscription_type !== "Gold"
          );

          setFeaturedBusinesses(featuredBusinesses);
          setBusinesses(nonGoldCompanies);
          setFilteredBusinesses(nonGoldCompanies);
          CustomToast('Refreshed 👍', 'Businesses refreshed successfully')

          await loadBusinesses();
          setLastRefresh("Last refresh was just now");
        } catch (err) {
          console.log("API Error:", err.message);
          await loadBusinesses();
          setLastRefresh("Using cached data (network unavailable)");
        }
      } else {
        await loadBusinesses();
        setLastRefresh("Using cached data (offline mode)");
      }
    } catch (err) {
      console.log("General Error:", err.message);
      await loadBusinesses();
      setLastRefresh("Using cached data");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    handleRefresh();
  }, []);

  const hide = searchQuery.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Custom Loader */}
      {(featuredBusinesses?.length === 0 && filteredBusinesses?.length === 0) && <CustomLoader />}

      {/* Upgrade Modal for Bronze Businesses */}
      <CustomModal
        isModalVisible={upgradeModalVisible}
        selectedBronzeBusiness={selectedBronzeBusiness}
        onClose={() => setUpgradeModalVisible(false)}
      />

      {/* Custom Alert */}
      <AlertUI />

      {/* App Title */}
      <View style={styles.titleContainer}>
        {/* menu button */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icons.Ionicons name="menu-outline" size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={eswatini}
            style={styles.image}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.appTitle, isDarkMode && styles.darkText]}>eSwatini</Text>
            <Text style={[styles.appSubTitle, isDarkMode && styles.darkText]}>Directory</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icons.Ionicons
            name="search-outline"
            size={20}
            color="#AAAAAA"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search business..."
            style={styles.searchInput}
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            numberOfLines={1}
          />
        </View>
      </View>

      <View style={styles.lastRefreshContainer}>
        <Icons.Ionicons name="time-outline" size={14} color={isDarkMode ? "#AAAAAA" : "#777777"} />
        <Text style={styles.lastRefreshText}>
          {lastRefresh || "Checking data age..."}
        </Text>
      </View>

      {!hide ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#003366']} // Spinner color (Android only)
              tintColor="#003366"  // Spinner color (iOS only)
              progressBackgroundColor="#ffff" // Background of the spinner (Android)
            />
          }
        >
          {/* Featured Businesses */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exclusive</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Featured", { featuredBusinesses })
                }
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredListContent}
            >
              {featuredBusinesses.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.featuredItem}
                  onPress={() => onBusinessPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.featuredImageContainer}>
                    {item.logo ? (
                      <Image
                        source={{ uri: item.logo }}
                        style={styles.featuredImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.placeholderContent}>
                        <Text style={styles.placeholderText}>
                          {item.company_name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {item.company_name}
                  </Text>
                  <Text style={styles.featuredCategory} numberOfLines={1}>
                    {item.company_type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollContent}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    activeCategory === category && styles.activeCategoryButton,
                  ]}
                  onPress={() => {
                    setActiveCategory(category);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      activeCategory === category && styles.activeCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* All Businesses */}
          <View style={styles.businessesContainer}>
            <Text style={styles.businessesTitle}>Featured</Text>
            <View>
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.favoriteCard}
                    activeOpacity={0.8}
                    onPress={() => onBusinessPress(item)}
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

                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Icons.Ionicons
                          name={
                            isInFavorites(item._id) ? "heart" : "heart-outline"
                          }
                          size={22}
                          color={
                            isInFavorites(item._id) ? "#003366" : "#AAAAAA"
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCall(
                            item.phone,
                            item.name
                          )
                        }}
                      >
                        <Icons.Ionicons
                          name="call-outline"
                          size={18}
                          color="#003366"
                        />
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
                            <Icons.Ionicons
                              name="logo-whatsapp"
                              size={18}
                              color="#25D366"
                            />
                            <Text style={styles.actionButtonText}>
                              WhatsApp
                            </Text>
                          </TouchableOpacity>
                        )}

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleEmail(item.email, e);
                        }}
                      >
                        <Icons.Ionicons
                          name="mail-outline"
                          size={18}
                          color="#FF9500"
                        />
                        <Text style={styles.actionButtonText}>Email</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleLocation(item.address, e);
                        }}
                      >
                        <Icons.Ionicons
                          name="location-outline"
                          size={18}
                          color="#5856D6"
                        />
                        <Text style={styles.actionButtonText}>Map</Text>
                      </TouchableOpacity>
                    </View>

                    {/* {item.subscription_type.toLowerCase() !== "bronze" && ( */}
                    <TouchableOpacity
                      style={styles.viewDetailsButton}
                      onPress={() => onBusinessPress(item)}
                    >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <Icons.Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#003366"
                      />
                    </TouchableOpacity>
                    {/* )} */}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Icons.Ionicons name="search" size={48} color="#DDDDDD" />
                  <Text style={styles.noResultsText}>No businesses found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try a different search or category
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.businessesContainer}>
            <View>
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.favoriteCard}
                    activeOpacity={0.8}
                    onPress={() => onBusinessPress(item)}
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

                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Icons.Ionicons
                          name={
                            isInFavorites(item._id) ? "heart" : "heart-outline"
                          }
                          size={22}
                          color={
                            isInFavorites(item._id) ? "#003366" : "#AAAAAA"
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCall(item.phone, item.name)
                        }}
                      >
                        <Icons.Ionicons
                          name="call-outline"
                          size={18}
                          color="#003366"
                        />
                        <Text style={styles.actionButtonText}>Call</Text>
                      </TouchableOpacity>

                      {item.phone &&
                        item.phone.some((p) => p.phone_type == "whatsapp") && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) =>
                              handleWhatsapp(item.phone, e)
                            }
                          >
                            <Icons.Ionicons
                              name="logo-whatsapp"
                              size={18}
                              color="#25D366"
                            />
                            <Text style={styles.actionButtonText}>
                              WhatsApp
                            </Text>
                          </TouchableOpacity>
                        )
                      }

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleEmail(item.email, e);
                        }}
                      >
                        <Icons.Ionicons
                          name="mail-outline"
                          size={18}
                          color="#FF9500"
                        />
                        <Text style={styles.actionButtonText}>Email</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleLocation(item.address, e);
                        }}
                      >
                        <Icons.Ionicons
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
                        <Icons.Ionicons
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
                  <Icons.Ionicons name="search" size={48} color="#DDDDDD" />
                  <Text style={styles.noResultsText}>No businesses found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try a different search or category
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView >
      )}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  darkDrawerContainer: {
    backgroundColor: "#1C2526",
  },
  drawerHeader: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  drawerSection: {
    marginVertical: 20,
  },
  drawerSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  activeDrawerItem: {
    backgroundColor: "#F0F4FF",
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 10,
    flex: 1,
  },
  drawerIcon: {
    marginRight: 8,
  },

  image: {
    width: 60,
    height: 40,
    borderRadius: 5,
  },

  // that has always been there
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  lastRefreshContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
    marginHorizontal: 24,
  },
  lastRefreshText: {
    fontSize: 12,
    color: "#777777",
    marginLeft: 4,
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
    fontSize: 17,
    fontWeight: "400",
    color: "#333333",
    letterSpacing: -0.5,
  },
  appSubTitle: {
    fontSize: 17,
    fontWeight: "200",
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "400",
    flex: 1,
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
    width: 100,
    alignItems: "center",
    marginRight: 20,
  },
  featuredImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: 60,
    height: 60,
    objectFit: 'cover'
  },
  placeholderContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003366",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  featuredName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 2,
  },
  featuredCategory: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
  },
  categoriesContainer: {
    marginBottom: 28,
  },
  categoriesScrollContent: {
    paddingHorizontal: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#F8F8F8",
  },
  activeCategoryButton: {
    backgroundColor: "#003366",
  },
  categoryText: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  businessesContainer: {
    paddingHorizontal: 10,
  },
  businessesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
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
    paddingRight: 30,
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

export default HomeScreen;
