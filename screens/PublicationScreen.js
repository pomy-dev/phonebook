import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
} from "react-native";
import { useTheme, useNavigation, useRoute } from "@react-navigation/native";
import { mockPublications, mockPromotions } from "../utils/mockData";
import { Icons } from "../utils/Icons";

const CompanyCard = ({ item, navigation, colors, contentType }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = contentType === "Promotions" ? item.promotions : item.publications;

  useEffect(() => {
    if (data.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % data.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data.length]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate("Promotions", { company: item, contentType })
      }
      activeOpacity={0.8}
      accessibilityLabel={`View ${contentType} for ${item.name}`}
    >
      <View style={styles.cardHeader}>
        <Image
          source={item.logo}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        <View style={styles.companyInfo}>
          <Text style={[styles.companyName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.companyIndustry, { color: colors.border }]}>
            {item.industry}
          </Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={item.publications}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            style={styles.highlightBackground}
            imageStyle={styles.highlightImage}
          >
            <View style={styles.highlightOverlay}>
              <Text style={styles.highlightTeaser}>{item.teaser}</Text>
              <Text style={styles.highlightDate}>
                {new Date(item.postedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </ImageBackground>
        )}
        keyExtractor={(pub) => pub.id}
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

  // Select data based on contentType
  const data = contentType === "Promotions" ? mockPromotions : mockPublications;
  const filteredCompanies = data.filter(
    (company) => company.name?.toLocaleLowerCase()?.includes(searchQuery?.toLowerCase()) || searchQuery === ""
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <View style={styles.header}>
        {/* back button */}
        <TouchableOpacity
          style={{ left: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons.Ionicons
            name="arrow-back-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        {/* Screen title */}
        <Text style={{ fontSize: 24, fontWeight: "700", left: '13%', color: colors.text }}>
          Publications & Articles
        </Text>
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
          <CompanyCard item={item} navigation={navigation} colors={colors} contentType={contentType} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No publications available.
          </Text>
        }
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
});


export default PublicationScreen;