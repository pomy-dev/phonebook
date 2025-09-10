import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Alert
} from "react-native"
import { Icons } from "../constants/Icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CustomToast } from "../components/customToast"
import { useCallFunction } from '../components/customCallAlert'
import { AppContext } from '../context/appContext';
import CustomCard from "../components/customCard"
import { handleEmail, handleBusinessPress, handleLocation, handleWhatsapp } from "../utils/callFunctions"

const FeaturedScreen = ({ route, navigation }) => {
  const { theme, isDarkMode } = React.useContext(AppContext);
  const [favorites, setFavorites] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const { handleCall, AlertUI } = useCallFunction();

  const { featuredBusinesses } = route.params || [
    {
      id: 1,
      company_name: "RSTP",
      company_type: "Government",
      subcribtion_type: "Gold",
      description:
        "Royal Science and Technology Park is a government initiative aimed at fostering innovation and technological advancement in Eswatini.",
      phone: [
        { phone_type: "call", number: "+268 2404 2811" },
        { phone_type: "mobile", number: "+268 7604 2811" },
        { phone_type: "whatsapp", number: "+268 7604 2811" },
      ],
      address: "Mbabane",
      email: "info@rstp.org.sz",
      logo: "https://www.iasp.ws/media/imagegenerator/290x290/upscale(false)/canvascolor(0xffffffff)/RSTP_Logo-01_8.png",
      website: "https://rstp.org.sz",
    },
  ]

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

    // Add a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    // Clean up the listener
    return unsubscribe;
  }, [navigation]);

  // Check if a business is in favorites
  const isInFavorites = (businessId) => {
    return favorites.some(fav => fav._id === businessId);
  };

  // Toggle favorite status
  const toggleFavorite = async (business) => {
    try {
      let newFavorites = [...favorites];

      if (isInFavorites(business._id)) {
        // Remove from favorites
        newFavorites = newFavorites.filter(fav => fav._id !== business._id);
        CustomToast('Removed from Favorites', `${business.company_name} has been removed from your favorites.`)
      } else {
        // Add to favorites
        newFavorites.push(business);
        CustomToast('Added to Favorites', `${business.company_name} has been added to your favorites.`)
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

  const onBusinessPress = (business) => {
    handleBusinessPress(
      business,
      navigation,
      setSelectedBronzeBusiness,
      setUpgradeModalVisible
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      // key={index}
      style={[styles.favoriteCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.8}
      onPress={() => onBusinessPress(business)}
    >
      <View style={styles.favoriteHeader}>
        <View style={styles.businessImageContainer}>
          {business.logo ? (
            <Image
              source={{ uri: business.logo }}
              style={styles.businessImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.businessInitialContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.businessInitial, { color: theme.colors.background }]}>
                {business.company_name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.businessInfo}>
          <Text
            style={[styles.businessName, { color: theme.colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {business.company_name}
          </Text>
          <Text
            style={[styles.businessCategory, { color: theme.colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {business.company_type}
          </Text>
          <Text
            style={[styles.businessAddress, { color: theme.colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {business.address}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(business);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icons.Ionicons
            name={
              isInFavorites(business._id) ? "heart" : "heart-outline"
            }
            size={22}
            color={isInFavorites(business._id) ? theme.colors.primary : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.secondary }]} />

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={(e) => {
            e.stopPropagation();
            handleCall(business.phone, business.name);
          }}
        >
          <Icons.Ionicons name="call-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.light }]}>Call</Text>
        </TouchableOpacity>

        {business.phone &&
          business.phone.some((p) => p.phone_type === "whatsapp") && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
              onPress={(e) => {
                e.stopPropagation();
                handleWhatsapp(business.phone);
              }}
            >
              <Icons.Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={[styles.actionButtonText, { color: theme.colors.light }]}>WhatsApp</Text>
            </TouchableOpacity>
          )}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={(e) => {
            e.stopPropagation();
            handleEmail(business.email, e);
          }}
        >
          <Icons.Ionicons name="mail-outline" size={18} color="#FF9500" />
          <Text style={[styles.actionButtonText, { color: theme.colors.light }]}>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={(e) => {
            e.stopPropagation();
            handleLocation(business.address, e);
          }}
        >
          <Icons.Ionicons name="location-outline" size={18} color="#5856D6" />
          <Text style={[styles.actionButtonText, { color: theme.colors.light }]}>Map</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.viewDetailsButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => onBusinessPress(business)}
      >
        <Text style={[styles.viewDetailsText, { color: "#FFFF" }]}>View Details</Text>
        <Icons.Ionicons name="chevron-forward" size={16} color='#FFFF' />
      </TouchableOpacity>

    </TouchableOpacity>
    // <CustomCard
    //   business={item}
    //   index={item._id}
    //   theme={theme}
    //   onBusinessPress={onBusinessPress}
    //   toggleFavorite={toggleFavorite}
    //   isInFavorites={isInFavorites}
    //   handleCall={handleCall}
    //   handleEmail={handleEmail}
    //   handleWhatsapp={handleWhatsapp}
    //   handleLocation={handleLocation}
    // />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <AlertUI />

      {/* Header */}
      <View style={[styles.header, {
        borderBottomColor: theme.colors.secondary
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Exclusive Businesses</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={featuredBusinesses}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderBusinessItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Icons.Ionicons name="business-outline" size={48} color="#DDDDDD" />
            <Text style={styles.noResultsText}>No businesses found</Text>
            <Text style={styles.noResultsSubtext}>
              Try a different search term
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor="transparent"
            progressBackgroundColor={theme.colors.card}
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 15,
    paddingTop: 36,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
  },
  divider: {
    height: 1,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginRight: 4,
  },
})

export default FeaturedScreen