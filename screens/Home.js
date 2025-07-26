"use client";
import { useState, useEffect } from "react";
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
  Dimensions,
  Linking,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import connectWhatsApp from "../components/connectWhatsApp";
import connectEmail from "../components/connectEmail";
import findLocation from "../components/findLocation";
import {
  fetchAllCompanies,
  fetchAllCompaniesOffline,
  fetchCompaniesWithAge,
} from "../service/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkNetworkConnectivity } from "../service/checkNetwork";

const { width } = Dimensions.get("window");

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
  const [isSearch, setIsSearch] = useState(false);

  const categories = ["All", "Government", "Emergency", "More..."];

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

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
    filterBusinesses(allBusinesses, activeCategory, searchQuery);
  }, [searchQuery, activeCategory, allBusinesses]);

  const filterBusinesses = (
    data = allBusinesses,
    category = activeCategory,
    query = searchQuery
  ) => {
    const filtered = data.filter((business) => {
      const matchesCategory =
        category === "All" ||
        business.company_type?.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        business.company_name
          .toLowerCase()
          .includes(query.toLowerCase().trim()) ||
        business.company_type
          .toLowerCase()
          .includes(query.toLowerCase().trim()) ||
        business.address.toLowerCase().includes(query.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });

    setFilteredBusinesses(filtered);
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

  const handleCall = (phoneNumbers) => {
    if (!phoneNumbers || phoneNumbers.length === 0) {
      Alert.alert(
        "No Phone Number",
        "This business has no phone number listed."
      );
      return;
    }

    if (phoneNumbers.length === 1) {
      Alert.alert(
        "Call Business",
        `Would you like to call ${phoneNumbers[0].number}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Call",
            onPress: () => Linking.openURL(`tel:${phoneNumbers[0].number}`),
          },
        ]
      );
    } else if (phoneNumbers.length > 1) {
      const options = phoneNumbers.map((phone) => ({
        text: `${phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)
          }: ${phone.number}`,
        onPress: () => Linking.openURL(`tel:${phone.number}`),
      }));

      options.push({ text: "Cancel", style: "cancel" });

      Alert.alert("Select Phone Number", "Choose a number to call", options);
    }
  };

  const handleBusinessPress = (business) => {
    if (business.subscription_type.toLowerCase() === "bronze") {
      setSelectedBronzeBusiness(business);
      setUpgradeModalVisible(true);
    } else {
      navigation.navigate("BusinessDetail", { business });
    }
  };

  const handleWhatsapp = (phones) => {
    if (!phones || phones.length === 0) {
      Alert.alert(
        "No WhatsApp",
        "This business has no WhatsApp number listed."
      );
      return;
    }

    for (const number in phones) {
      if (phones[number].phone_type == "whatsapp") {
        connectWhatsApp(phones[number].number);
        return;
      } else {
        Alert.alert(
          "No WhatsApp",
          "This business has no WhatsApp number listed."
        );
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
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

          Alert.alert("Success", "Business listings refreshed successfully");
          loadBusinesses();
          setLastRefresh("Last refresh was just now");
        } catch (err) {
          console.log("API Error:", err.message);
          await loadBusinesses();
          setLastRefresh("Using cached data (network unavailable)");
        }
      } else {
        loadBusinesses();
        setLastRefresh("Using cached data (offline mode)");
      }
    } catch (err) {
      console.log("General Error:", err.message);
      loadBusinesses();
      setLastRefresh("Using cached data");
    } finally {
      setLoading(false);
    }
  };

  const hide = searchQuery.length > 0;

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
                  <Text style={styles.upgradeBusinessName}>
                    {selectedBronzeBusiness.company_name}
                  </Text>
                  <Text style={styles.businessType}>
                    {selectedBronzeBusiness.company_type}
                  </Text>
                </View>

                <View style={styles.basicInfoContainer}>
                  {selectedBronzeBusiness.phone &&
                    selectedBronzeBusiness.phone.length > 0 && (
                      <TouchableOpacity
                        style={styles.basicInfoItem}
                        onPress={() => handleCall(selectedBronzeBusiness.phone)}
                      >
                        <Ionicons
                          name="call-outline"
                          size={20}
                          color="#003366"
                        />
                        <Text style={styles.basicInfoText}>
                          {selectedBronzeBusiness.phone[0].number}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {selectedBronzeBusiness.phone &&
                    selectedBronzeBusiness.phone.some(
                      (p) => p.phone_type === "whatsApp"
                    ) && (
                      <TouchableOpacity
                        style={styles.basicInfoItem}
                        onPress={() =>
                          handleWhatsapp(selectedBronzeBusiness.phone)
                        }
                      >
                        <Ionicons
                          name="logo-whatsapp"
                          size={20}
                          color="#25D366"
                        />
                        <Text style={styles.basicInfoText}>
                          {selectedBronzeBusiness.phone.find(
                            (p) => p.phone_type === "whatsApp"
                          )?.number || selectedBronzeBusiness.phone[0].number}
                        </Text>
                      </TouchableOpacity>
                    )}

                  <TouchableOpacity
                    style={styles.basicInfoItem}
                    onPress={() => findLocation(selectedBronzeBusiness.address)}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#5856D6"
                    />
                    <Text style={styles.basicInfoText}>
                      {selectedBronzeBusiness.address}
                    </Text>
                  </TouchableOpacity>

                  {selectedBronzeBusiness.email && (
                    <TouchableOpacity
                      style={styles.basicInfoItem}
                      onPress={() => connectEmail(selectedBronzeBusiness.email)}
                    >
                      <Ionicons name="mail-outline" size={20} color="#FF9500" />
                      <Text style={styles.basicInfoText}>
                        {selectedBronzeBusiness.email}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    onPress={() => {
                      setUpgradeModalVisible(false);
                      if (
                        selectedBronzeBusiness.phone &&
                        selectedBronzeBusiness.phone.length > 0
                      ) {
                        handleCall(selectedBronzeBusiness.phone);
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
                        handleWhatsapp(selectedBronzeBusiness.phone);
                      }}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={20}
                        color="#25D366"
                      />
                      <Text style={styles.secondaryActionText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        connectEmail(selectedBronzeBusiness.email);
                      }}
                    >
                      <Ionicons name="mail-outline" size={20} color="#FF9500" />
                      <Text style={styles.secondaryActionText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        findLocation(selectedBronzeBusiness.address);
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#5856D6"
                      />
                      <Text style={styles.secondaryActionText}>Map</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* App Title */}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons
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
          // onFocus={search}
          />
        </View>
      </View>

      <View style={styles.lastRefreshContainer}>
        <Ionicons name="time-outline" size={14} color="#777777" />
        <Text style={styles.lastRefreshText}>
          {lastRefresh || "Checking data age..."}
        </Text>
      </View>

      {!hide ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Featured Businesses */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured</Text>
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
                  onPress={() => handleBusinessPress(item)}
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
            <Text style={styles.businessesTitle}>Businesses</Text>
            <View>
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

      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 10,
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
    paddingHorizontal: 24,
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
    width: 76,
    height: 76,
    borderRadius: 38,
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
    width: 50,
    height: 50,
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