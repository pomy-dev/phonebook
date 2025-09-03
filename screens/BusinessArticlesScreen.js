import { useState, useRef, useEffect, useCallback, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
  Animated,
  Platform,
  StatusBar,
  Linking,
  Easing,
  Alert,
} from "react-native";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { Icons } from "../constants/Icons";
import { BlurView } from "expo-blur";
import { useCallFunction } from "../components/customCallAlert";
import { handleWhatsapp, handleEmail, handleShareVia } from "../utils/callFunctions";
import { fetchCompanyNews, fetchCompanyAds } from "../service/getApi";
import CustomLoader from "../components/customLoader";
import { AppContext } from '../context/appContext';
import { checkNetworkConnectivity } from '../service/checkNetwork';

const BusinessArticlesScreen = () => {
  const { isDarkMode, theme, isOnline, notificationsEnabled, toggleOnlineMode } = useContext(AppContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [fabOpen, setFabOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { company, contentType = "Publications" } = route.params;
  const { width } = useWindowDimensions();
  const [expandedItems, setExpandedItems] = useState({});
  const { handleCall, AlertUI } = useCallFunction();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
  const shareOptionsAnim = useRef(new Animated.Value(0)).current;

  const safeCompany = company || { name: "Unknown Company", phone: [], social_media: [], publications: [], promotions: [] };
  const numberObject = safeCompany.phone;
  const Calls = [];
  Calls.push(safeCompany.phone.find((num) => num.phone_type === 'call'));

  useEffect(() => {
    checkNetworkAndFetch();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const checkNetworkAndFetch = async () => {
    try {
      setIsLoading(true);
      if (isOnline) {
        const stateConnection = await checkNetworkConnectivity();
        setIsConnected(stateConnection);
        if (!stateConnection) {
          Alert.alert(
            "No Internet Connection",
            "Please turn on Wi-Fi or mobile data to view content.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
          );
        }

        if (contentType === "Publications") {
          setError(null);
          try {
            if (!safeCompany.publications || safeCompany.publications.length === 0) {
              const response = await fetchCompanyNews(safeCompany._id);
              response.publications.length > 0 ? setData(response.publications) : setData([]);
            } else {
              setData(safeCompany.publications);
            }
          } catch (err) {
            console.error('Error fetching publications:', err);
            setError('Failed to load publications.', err);
          }
        }

        if (contentType === "Promotions") {
          setError(null);
          try {
            if (!safeCompany.promotions || safeCompany.promotions.length === 0) {
              const response = await fetchCompanyAds(safeCompany._id);
              response.promotions.length > 0 ? setData(response.promotions) : setData([]);
            } else {
              setData(safeCompany.promotions);
            }
          } catch (err) {
            console.error('Error fetching promotions:', err);
            setError('Failed to load promotions', err);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        Alert.alert(
          "Internet Connection Is Off",
          "Please turn on Wi-Fi of app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Ok", onPress: () => { toggleOnlineMode() } },
          ]
        );
      }
    } catch (error) {
      console.log("Error", error)
      setError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    if (showShareOptions) {
      Animated.spring(shareOptionsAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(shareOptionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showShareOptions]);

  const handleShare = async (item) => {
    setSelectedItem(item);
    setShowShareOptions(!showShareOptions);
  };

  const shareVia = async (method) => {
    await handleShareVia(method, company, selectedItem);
    setShowShareOptions(false);
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

  const companySocialMediaLinks = company.social_media?.map((link) => ({
    name: link.platform,
    icon: link.platform === 'Facebook' ? "facebook" : link.platform === "Twitter" ? "twitter" : link.platform === "LinkedIn" ? "linkedin" : link.platform === "Instagram" ? "instagram" : "globe",
    color: link.platform === 'Facebook' ? "#1877F2" : link.platform === "Twitter" ? "#1DA1F2" : link.platform === "LinkedIn" ? "#0077B5" : link.platform === "Instagram" ? "#C13584" : "#60A5FA",
    url: link.link,
  })) || [];

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

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await checkNetworkAndFetch();
    } catch (error) {
      console.log("Refresh Error:", error.message);
      setError("Refresh Error", error.message);
    } finally {
      setRefreshing(false);
    }
  }, [isOnline]);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafacc" translucent />

      {isLoading && <CustomLoader />}

      <View style={[styles.containerScreen, { backgroundColor: colors.background }]}>

        <AlertUI />

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={{ left: 10 }} onPress={() => navigation.goBack()}>
              <Icons.Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
              {company.company_name.length > 17
                ? company.company_name.slice(0, 17) + "..."
                : company.company_name}
            </Text>
            <Image
              source={{ uri: company.logo }}
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
                onPress={(e) => numberObject && handleCall(Calls)}
                style={styles.button}
              >
                <Icons.FontAwesome name="phone" size={24} color="#003366" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => handleWhatsapp(numberObject, e)}
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

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressBackgroundColor={theme.colors.card}
            />
          }
        >
          {data?.map((item) => (
            <View
              key={item?._id}
              style={[styles.articleContainer, { backgroundColor: colors.card }]}
            >
              {contentType === "Promotions" ? (
                <Image
                  source={{ uri: item?.banner }}
                  style={[styles.articleImage, { width: width - 10 }]}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{ uri: item?.featured_image }}
                  style={[styles.articleImage, { width: width - 10 }]}
                  resizeMode="cover"
                />
              )}
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

                  <TouchableOpacity onPress={() => handleShare(item)}>
                    <Icons.Feather name="share-2" size={24} color={"#003366"} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.articleIntro, { color: colors.text }]}>
                  {contentType === "Promotions" ? item.description : item.intro}
                </Text>
                {contentType !== "Promotions" && expandedItems[item._id] && (
                  <View style={styles.expandedContent}>
                    <Text style={[styles.articleParagraph, { color: "#7d7d7dff" }]}>
                      {item.content}
                    </Text>
                    {item.video_url && (
                      <TouchableOpacity
                        style={styles.youtubeButton}
                        onPress={() => Linking.openURL(item.video_url)}
                        accessibilityLabel="Watch video on YouTube"
                      >
                        <Icons.AntDesign name="youtube" size={24} color="#FF0000" />
                        <Text style={[styles.youtubeButtonText, { color: theme.colors.light }]}>Watch on YouTube</Text>
                      </TouchableOpacity>
                    )}
                    {item.conclusion && (
                      <Text style={[styles.articleParagraph, { color: "#7d7d7dff" }]}>
                        {item.conclusion}
                      </Text>
                    )}
                  </View>
                )}
                {contentType !== "Promotions" && (
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => toggleItem(item._id)}
                    accessibilityLabel={
                      expandedItems[item._id] ? `Collapse ${item.title}` : `Expand ${item.title}`
                    }
                  >
                    <Text style={styles.readMoreText}>
                      {expandedItems[item._id] ? "Read Less" : "Read More"}
                    </Text>
                    <Icons.Ionicons
                      name={expandedItems[item._id] ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#003366"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          {error && (
            <View>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No {contentType.toLowerCase()} available.
              </Text>
              <Text style={[styles.emptyText, { color: '#b34141ff' }]}>
                {error}!
              </Text>
            </View>
          )}
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

        <Animated.View
          style={[
            styles.shareOptionsContainer,
            Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 250 },
            {
              opacity: shareOptionsAnim,
              transform: [
                {
                  translateY: shareOptionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={showShareOptions ? "auto" : "none"}
        >
          <BlurView intensity={80} style={styles.shareOptionsBlur}>
            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("message")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#4CD964" }]}>
                <Icons.Ionicons name="chatbox-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("email")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#FF9500" }]}>
                <Icons.Ionicons name="mail-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("copy")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#5856D6" }]}>
                <Icons.Ionicons name="copy-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("more")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#8E8E93" }]}>
                <Icons.Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>More</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  containerScreen: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 25,
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
    marginTop: 8,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  youtubeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
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
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 20,
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
  shareOptionsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 90,
    right: 16,
    borderRadius: 16,
    zIndex: 100,
  },
  shareOptionsBlur: {
    flexDirection: "row",
    backgroundColor: Platform.OS === "ios" ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareOption: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  shareOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shareOptionText: {
    fontSize: 12,
    color: "#333333",
  },
});

export default BusinessArticlesScreen;