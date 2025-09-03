import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  Alert
} from "react-native";
import { useTheme, useNavigation, useRoute } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { Icons } from "../constants/Icons";
import CustomLoader from '../components/customLoader';
import { fetchPromotions, fetchPublications } from "../service/getApi";

const CompanyCard = ({ item, navigation, colors, contentType }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = contentType === "Promotions" ? item.promotions : item.publications;

  useEffect(() => {
    if (data?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % data?.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data?.length]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate("BusinessArticlesScreen", { company: item, contentType })
      }
      activeOpacity={0.8}
      accessibilityLabel={`View ${contentType} for ${item.company_name}`}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.logo }}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        <View style={styles.companyInfo}>
          <Text style={[styles.companyName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            {item.company_name}
          </Text>
          <Text style={[styles.companyIndustry, { color: colors.border }]}>
            {item.company_type}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: contentType === "Promotions" ? item.banner : item.featured_image }}
            style={styles.highlightBackground}
            imageStyle={styles.highlightImage}
            key={item._id}
          >
            <View style={styles.highlightOverlay}>
              <Text style={styles.highlightTeaser}>{item.teaser_message}</Text>
              <Text style={styles.highlightDate}>
                {contentType === "Promotions"
                  ? `Valid until ${new Date(item.validUntil).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}`
                  : new Date(item.publish_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
              </Text>
            </View>
          </ImageBackground>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={() => { }}
      />
    </TouchableOpacity>
  );
};

const PublicationScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState("");
  const contentType = route.params?.contentType || "Publications";
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check network status on mount
  useEffect(() => {
    const checkNetwork = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please turn on Wi-Fi or mobile data to view content.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    };

    checkNetwork();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Fetch data based on contentType
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (contentType === "Promotions") {
        const fetchedPromotions = await fetchPromotions((newPromotions) => {
          setPromotions(newPromotions || []); // Update state with each page
        });
        setPromotions(fetchedPromotions.promotions || []);
      } else {
        const fetchedPublications = await fetchPublications((newPublications) => {
          setPublications(newPublications || []); // Update state with each page
        });
        setPublications(fetchedPublications.publications || []);
      }
    } catch (err) {
      setError(`Failed to load ${contentType.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) return;
    loadData();
  }, [contentType, isConnected]);

  // Retry connection or data fetch
  const retryConnection = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
    if (!state.isConnected) {
      Alert.alert(
        "No Internet Connection",
        "Please turn on Wi-Fi or mobile data to view content.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    // load data
    loadData()
  };

  // Select data based on contentType
  const data = contentType === "Promotions" ? promotions : publications;
  const filteredCompanies = Array.isArray(data)
    ? data.filter(
      (company) =>
        company.company_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        searchQuery === ""
    )
    : [];

  if (!isConnected) {
    return (
      <View style={[styles.noConnectionContainer, { backgroundColor: colors.background }]}>
        <Icons.MaterialIcons
          name="signal-wifi-off"
          size={80}
          color={colors.text}
          style={styles.noConnectionIcon}
        />
        <Text style={[styles.noConnectionText, { color: colors.text }]}>
          No Internet Connection
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
          <Text style={styles.retryButtonText}>Turn On Wi-Fi or Data</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.noConnectionContainer, { backgroundColor: colors.background }]}>
        <CustomLoader />
        <Text style={[styles.noConnectionText, { color: colors.text }]}>
          Loading {contentType.toLowerCase()}...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.noConnectionContainer, { backgroundColor: colors.background }]}>
        <Icons.MaterialIcons
          name="error-outline"
          size={80}
          color={colors.text}
          style={styles.noConnectionIcon}
        />
        <Text style={[styles.noConnectionText, { color: colors.text }]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (contentType === "Promotions") {
        const companyPromotions = await fetchPromotions();
        setPromotions(companyPromotions.promotions)
      } else {
        const companyPublications = await fetchPublications();
        setPublications(companyPublications.publications)
      }
    } catch (err) {
      console.log("Refresh Error:", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={{ left: 10 }} onPress={() => navigation.goBack()}>
          <Icons.Ionicons
            name="arrow-back-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "700", left: "13%", color: colors.text }}>
          {contentType === "Promotions" ? "Promotions/Adverts" : "Publications/Articles"}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icons.Ionicons
            name="search-outline"
            size={20}
            color="#AAAAAA"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Filter by business..."
            style={styles.searchInput}
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            numberOfLines={1}
          />
        </View>
      </View>

      <FlatList
        data={filteredCompanies}
        renderItem={({ item }) => (
          <CompanyCard
            item={item}
            navigation={navigation}
            colors={colors}
            contentType={contentType}
          />
        )}
        keyExtractor={(item) => item?.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No {contentType.toLowerCase()} available.
          </Text>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 5,
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
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 10,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: "#FFFFFF",
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  companyLogo: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 8,
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  highlightBackground: {
    width: 300,
    height: 120,
  },
  highlightImage: {
    borderRadius: 8,
  },
  highlightOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "space-between",
    padding: 12,
  },
  highlightTeaser: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  highlightDate: {
    color: "#E0E0E0",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "right",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 20,
  },
  noConnectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noConnectionIcon: {
    marginBottom: 20,
  },
  noConnectionText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#003366",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PublicationScreen;