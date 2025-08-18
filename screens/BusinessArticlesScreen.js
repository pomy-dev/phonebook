import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { Icons } from "../utils/Icons";
import { useNavigation } from "@react-navigation/native";

const BusinessArticlesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [fabOpen, setFabOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { company } = route.params;
  const { width } = useWindowDimensions();
  const [expandedArticles, setExpandedArticles] = useState({});
  const [shareVia, setshareVia] = useState(false);

  const toggleArticle = (articleId) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
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

  // Define communication channels
  const communicationChanels = [
    {
      name: "Phone",
      icon: "phone",
      color: "#1E293B",
      url: `tel:${company.phone}`
    },
    {
      name: "Email",
      icon: "envelope",
      color: "#FF9500",
      url: `mailto:${company.email}`
    },
    {
      name: "WhatsApp",
      icon: "whatsapp",
      color: "#25D366",
      url: `https://wa.me/${company.whatsapp}`
    }
  ]

  // Define share options
  const shareViaOptions = [
    {
      name: "LinkedIn",
      icon: "linkedin",
      color: "#0077B5",
      url: ``
    },
    {
      name: "Twitter",
      icon: "twitter",
      color: "#1DA1F2",
      url: ``
    },
    {
      name: "Facebook",
      icon: "facebook",
      color: "#1877F2",
      url: ``
    },
    {
      name: "Instagram",
      icon: "instagram",
      color: "#C13584",
      url: ``
    }
  ]

  const companySocialMediaLinks = [
    {
      name: "Website",
      icon: "globe",
      color: "#60A5FA",
      url: 'https://company.com/'
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      color: "#0077B5",
      url: 'https://linkedin.com'
    },
    {
      name: "Twitter",
      icon: "twitter",
      color: "#1DA1F2",
      url: 'https://twitter.com'
    },
    {
      name: "Facebook",
      icon: "facebook",
      color: "#1877F2",
      url: 'https://facebook.com'
    },
    {
      name: "Instagram",
      icon: "instagram",
      color: "#C13584",
      url: 'https://instagram.com'
    }
  ]

  // const companySocialMediaLinks = company.socialMediaLinks.map((link) => ({
  //   name: link.name,
  //   icon: link.icon,
  //   color: link.color,
  //   url: link.url,
  // }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {/* back button */}
          <TouchableOpacity
            style={{ left: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Icons.Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
            {company.name}
          </Text>
          <Image
            source={company.logo}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.channels}>
          <Text style={{ marginLeft: 10, color: '#706f6fff', fontSize: 15 }}>
            Recent Articles
          </Text>
          {/* display social media links */}
          <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
            {communicationChanels.map((channel, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(channel.url)}
                style={styles.button}
              >
                <Icons.FontAwesome
                  name={channel.icon}
                  size={24}
                  color={channel.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {company.publications.map((article) => (
          <View
            key={article.id}
            style={[styles.articleContainer, { backgroundColor: colors.card }]}
          >
            <Image
              source={article.image}
              style={[styles.articleImage, { width: width - 10 }]}
              resizeMode="cover"
            />

            <View style={{ padding: 12 }}>
              <Text style={[styles.articleTitle, { color: colors.text }]}>
                {article.title}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.articleDate, { color: '#7d7d7dff' }]}>
                  {new Date(article.postedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </Text>

                {/* sharevia button */}
                <TouchableOpacity onPress={() => { }} >
                  <Icons.Feather name="share-2" size={24} color={'#003366'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.articleIntro, { color: colors.text }]}>
                {article.intro}
              </Text>

              {expandedArticles[article.id] && (
                <View style={styles.expandedContent}>
                  {article.paragraphs.map((paragraph, index) => (
                    <Text
                      key={index}
                      style={[styles.articleParagraph, { color: '#3d3c3cff' }]}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => toggleArticle(article.id)}
              >
                <Text style={styles.readMoreText}>
                  {expandedArticles[article.id] ? "Read Less" : "Read More"}
                </Text>
                <Icons.Ionicons
                  name={expandedArticles[article.id] ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#003366"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button Group */}
      <View style={styles.fabContainer}>
        {companySocialMediaLinks.map((link, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(70 * (index + 1))], // stack upwards
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.fabItem,
                {
                  transform: [{ translateY }],
                  opacity: animation,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => console.log("Open:", link.url)}
                style={[styles.fabButton, { backgroundColor: link.color }]}
              >
                <Icons.FontAwesome name={link.icon} size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Main FAB */}
        <TouchableOpacity style={styles.mainFab} onPress={toggleFab}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"], // spin animation
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
    borderBottomColor: '#f3f2f2ff'
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#f8f8f8ff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    width: 40,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5
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
    borderTopLeftRadius: 8
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
});

export default BusinessArticlesScreen;