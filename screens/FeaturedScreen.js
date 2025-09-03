import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
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
import { handleEmail, handleLocation, handleWhatsapp } from "../utils/callFunctions"

const FeaturedScreen = ({ route, navigation }) => {
  const { theme } = React.useContext(AppContext);
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
  const toggleFavorite = async (business, e) => {
    if (e) {
      e.stopPropagation();
    }

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AlertUI />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exclusive Businesses</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor="transparent"
            progressBackgroundColor={theme.colors.card}
          />
        }
      >
        {featuredBusinesses.map((business) => (
          <TouchableOpacity
            key={business._id}
            style={styles.favoriteCard}
            onPress={() => navigation.navigate("BusinessDetail", { business })}
            activeOpacity={0.8}
          >
            <View style={styles.favoriteHeader}>
              <View style={styles.businessImageContainer}>
                {business.logo ? (
                  <Image source={{ uri: business.logo }} style={styles.businessImage} resizeMode="cover" />
                ) : (
                  <View style={styles.businessInitialContainer}>
                    <Text style={styles.businessInitial}>{business.company_name.charAt(0)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.businessInfo}>
                <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">{business.company_name}</Text>
                <Text style={styles.businessCategory} numberOfLines={1} ellipsizeMode="tail">{business.company_type}</Text>
                <Text style={styles.businessAddress} numberOfLines={1} ellipsizeMode="tail">{business.address}</Text>
              </View>

              {/* Favorite heart icon */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => toggleFavorite(business, e)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icons.Ionicons
                  name={isInFavorites(business._id) ? "heart" : "heart-outline"}
                  size={22}
                  color={isInFavorites(business._id) ? "#003366" : "#AAAAAA"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => handleCall(business.phone, e)}
              >
                <Icons.Ionicons name="call-outline" size={18} color="#003366" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => handleWhatsapp(business.phone, e)}
              >
                <Icons.Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.actionButtonText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => handleEmail(business.email, e)}
              >
                <Icons.Ionicons name="mail-outline" size={18} color="#FF9500" />
                <Text style={styles.actionButtonText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => handleLocation(business.address, e)}
              >
                <Icons.Ionicons name="location-outline" size={18} color="#5856D6" />
                <Text style={styles.actionButtonText}>Map</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("BusinessDetail", { business })}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Icons.Ionicons name="chevron-forward" size={16} color="#003366" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 15,
    paddingTop: 36,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  // New card styles that match the FavoritesScreen
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
})

export default FeaturedScreen