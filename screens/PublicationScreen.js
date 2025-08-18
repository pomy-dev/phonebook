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
import { Images } from "../utils/Images";
import { Icons } from "../utils/Icons";

// Mock data
const mockCompanies = [
  {
    id: "1",
    name: "RSTP",
    industry: "Technology",
    logo: Images.RstpLogo,
    publications: [
      {
        id: "1-1",
        title: "AI-Powered Analytics Platform Launched",
        teaser: "Revolutionizing data analysis for businesses.",
        image: Images.RstpMainArticle,
        intro: "The Royal Science & Technology Park has launched a groundbreaking AI-powered analytics platform.",
        paragraphs: [
          "The platform integrates advanced machine learning algorithms for real-time insights.",
          "It ensures businesses of all sizes can harness AI without extensive expertise.",
        ],
        postedDate: "2025-08-01",
      },
      {
        id: "1-2",
        title: "RSTP Expands Cloud Services",
        teaser: "New cloud solutions for scalable business growth.",
        image: Images.RstpSubArticle,
        intro: "RSTP introduces cloud services to enhance business scalability.",
        paragraphs: [
          "The services offer secure, flexible solutions for data storage and processing.",
          "Integration with existing platforms is seamless, boosting efficiency.",
        ],
        postedDate: "2025-07-15",
      },
    ],
  },
  {
    id: "2",
    name: "Standard Bank",
    industry: "Finance",
    logo: Images.StandardBankLogo,
    publications: [
      {
        id: "2-1",
        title: "Standard Bank Secures $50M Funding",
        teaser: "Driving eco-friendly investment opportunities.",
        image: Images.StandardBankMain,
        intro: "Standard Bank Solutions announced a $50M funding round for sustainable investments.",
        paragraphs: [
          "The company supports renewable energy projects and green startups.",
          "The funding enhances GreenFin's digital platform for investors.",
        ],
        postedDate: "2025-06-20",
      },
    ],
  },
  {
    id: "3",
    name: "The Luke Commission",
    industry: "Healthcare",
    logo: Images.LukeLogo,
    publications: [
      {
        id: "3-1",
        title: "Telemedicine Expansion in eSwatini",
        teaser: "Bringing healthcare to rural communities.",
        image: Images.LukeMainArticle,
        intro: "HealthCare Plus rolls out telemedicine to improve access in underserved regions.",
        paragraphs: [
          "The initiative includes virtual consultations and mobile health units.",
          "Partnerships with local clinics support regional expansion.",
        ],
        postedDate: "2025-05-10",
      },
    ],
  },
];

const PublicationScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = mockCompanies.filter(
    (company) => company.name === searchQuery || searchQuery === ""
  );

  const CompanyCard = ({ item, navigation, colors }) => {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (item.publications.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % item.publications.length;
            flatListRef.current?.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
            return nextIndex;
          });
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [item.publications.length]);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() =>
          navigation.navigate("Promotions", { company: item })
        }
        activeOpacity={0.8}
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
        <Text style={{ left: 70, color: colors.text }}>
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
          <CompanyCard item={item} navigation={navigation} colors={colors} />
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
    paddingBottom: 20,
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