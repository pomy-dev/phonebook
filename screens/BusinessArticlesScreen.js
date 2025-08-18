import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { Icons } from "../utils/Icons";
import { useNavigation } from "@react-navigation/native";

const BusinessArticlesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { company } = route.params;
  const { width } = useWindowDimensions();
  const [expandedArticles, setExpandedArticles] = useState({});

  const toggleArticle = (articleId) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

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

          <Text style={[styles.header, { color: colors.text }]}>
            {company.name}
          </Text>
          <Image
            source={company.logo}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={[styles.header, { color: colors.text }]}>
            Articles
          </Text>
          {/* display social media links */}
          <View>
            {company.socialMediaLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(link.url)}
                style={{ marginRight: 10 }}
              >
                <Icons.FontAwesome
                  name={link.icon}
                  size={24}
                  color={colors.text}
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
            style={[styles.articleCard, { backgroundColor: colors.card }]}
          >
            <Image
              source={article.image}
              style={[styles.articleImage, { width: width - 30 }]}
              resizeMode="cover"
            />
            <Text style={[styles.articleTitle, { color: colors.text }]}>
              {article.title}
            </Text>
            <Text style={[styles.articleDate, { color: '#7d7d7dff' }]}>
              {new Date(article.postedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </Text>
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
                color="#60A5FA"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 20,
    paddingTop: 10,
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
  header: {
    fontSize: 24,
    fontWeight: "700",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  articleCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleImage: {
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
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
    color: "#60A5FA",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
});

export default BusinessArticlesScreen;