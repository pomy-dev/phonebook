import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Linking,
  Easing,
  Alert,
} from "react-native";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { Icons } from "../utils/Icons";
import { useCallFunction } from "../components/customCallAlert";
import { handleWhatsapp, handleEmail } from "../utils/callFunctions";

const BusinessArticlesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [fabOpen, setFabOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { company, contentType = "Publications" } = route.params;
  const { width } = useWindowDimensions();
  const [expandedItems, setExpandedItems] = useState({});
  const { handleCall, AlertUI } = useCallFunction();
  const [isConnected, setIsConnected] = useState(true);

  const data = contentType === "Promotions" ? company.ads : company.news;

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

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleFab = () => {
    if (fabOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    setFabOpen(!fabOpen);
  };

  const companySocialMediaLinks = company.social_media.map((link) => ({
    name: link.platform,
    icon: link.platform === 'Facebook' ? "facebook" : link.platform === "Twitter" ? "twitter" : link.platform === "LinkedIn" ? "linkedin" : link.platform === "Instagram" ? "instagram" : "globe",
    color: link.platform === 'Facebook' ? "#1877F2" : link.platform === "Twitter" ? "#1DA1F2" : link.platform === "LinkedIn" ? "#0077B5" : link.platform === "Instagram" ? "#C13584" : "#60A5FA",
    url: link.link,
  }));

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
    }
  };

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <AlertUI />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={{ left: 10 }} onPress={() => navigation.goBack()}>
            <Icons.Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
            {company.company_name}
          </Text>
          <Image
            source={company.logo}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.channels}>
          <Text style={{ marginLeft: 10, color: "#706f6fff", fontSize: 15 }}>
            Recent {contentType !== "Promotions" ? "Articles" : "Adverts"}
          </Text>
          <View style={{ justifyContent: "space-around", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={(e) => handleCall(company.phone.find((number) => number.type === "Call")?.number, e)}
              style={styles.button}
            >
              <Icons.FontAwesome name="phone" size={24} color="#003366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => handleWhatsapp(company.phone.find((number) => number.type === "WhatsApp")?.number, e)}
              style={styles.button}
            >
              <Icons.FontAwesome name="whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => handleEmail(company.email, e)}
              style={styles.button}
            >
              <Icons.Ionicons name="mail-outline" size={24} color="#FF9500" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {data?.map((item) => (
          <View
            key={item?._id}
            style={[styles.articleContainer, { backgroundColor: colors.card }]}
          >
            {contentType === "Promotions"
              ?
              <Image
                source={item?.banner}
                style={[styles.articleImage, { width: width - 10 }]}
                resizeMode="cover"
              />
              :
              <Image
                source={item?.featured_image}
                style={[styles.articleImage, { width: width - 10 }]}
                resizeMode="cover"
              />
            }
            <View style={{ padding: 12 }}>
              <Text style={[styles.articleTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={[styles.articleDate, { color: "#7d7d7dff" }]}>
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
                <TouchableOpacity onPress={() => { }}>
                  <Icons.Feather name="share-2" size={24} color={"#003366"} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.articleIntro, { color: colors.text }]}>
                {contentType === "Promotions" ? item.description : item.intro}
              </Text>
              {contentType !== "Promotions" && expandedItems[item.id] && (
                <View style={styles.expandedContent}>
                  <Text
                    key={index}
                    style={[styles.articleParagraph, { color: "#7d7d7dff" }]}
                  >
                    {item.content}
                  </Text>

                  <Text
                    key={index}
                    style={[styles.articleParagraph, { color: "#7d7d7dff" }]}
                  >
                    {item.conclussion}
                  </Text>
                </View>
              )}
              {contentType !== "Promotions" && (
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => toggleItem(item.id)}
                  accessibilityLabel={
                    expandedItems[item.id] ? `Collapse ${item.title}` : `Expand ${item.title}`
                  }
                >
                  <Text style={styles.readMoreText}>
                    {expandedItems[item.id] ? "Read Less" : "Read More"}
                  </Text>
                  <Icons.Ionicons
                    name={expandedItems[item.id] ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#003366"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.fabContainer}>
        {companySocialMediaLinks.map((link, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(70 * (index + 1))],
          });
          return (
            <Animated.View
              key={index}
              style={[styles.fabItem, { transform: [{ translateY }], opacity: animation }]}
            >
              <TouchableOpacity
                onPress={() => Linking.openURL(link.url)}
                style={[styles.fabButton, { backgroundColor: link.color }]}
              >
                <Icons.FontAwesome name={link.icon} size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <TouchableOpacity style={styles.mainFab} onPress={toggleFab}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            }}
          >
            <Icons.Ionicons name="add" size={28} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 20,
  },
  headerContainer: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f2ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyLogo: {
    width: 40,
    height: 40,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#a2a2a4ff",
    padding: 2,
    borderRadius: 8,
    marginRight: 12,
  },
  channels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#f8f8f8ff",
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
    width: 40,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  articleContainer: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleImage: {
    height: 180,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 8,
  },
  articleIntro: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 12,
  },
  expandedContent: {
    marginBottom: 12,
  },
  articleParagraph: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    marginBottom: 8,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  readMoreText: {
    color: "#003366",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 60,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#05254bff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabItem: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 20,
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

export default BusinessArticlesScreen;