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
    <CustomCard
      business={item}
      index={item._id}
      theme={theme}
      onBusinessPress={onBusinessPress}
      toggleFavorite={toggleFavorite}
      isInFavorites={isInFavorites}
      handleCall={handleCall}
      handleEmail={handleEmail}
      handleWhatsapp={handleWhatsapp}
      handleLocation={handleLocation}
    />
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
})

export default FeaturedScreen