import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const mockData = {
  businesses: [
    {
      id: 1,
      company_name: "Tourism Center",
      company_type: "Tourism",
      address: "123 Beach Rd",
    },
    {
      id: 2,
      company_name: "Emergency Response",
      company_type: "Emergency",
      address: "456 Rescue Ave",
    },
    {
      id: 3,
      company_name: "Gov Office",
      company_type: "Government",
      address: "789 Civic Blvd",
    },
  ],
};

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = (text) => {
    setLoading(true);
    setSearchQuery(text);

    const filteredData = mockData.businesses.filter((item) =>
      item.company_name.toLowerCase().includes(text.toLowerCase())
    );

    setTimeout(() => {
      setFiltered(filteredData);
      setLoading(false);
    }, 400); // simulate delay
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.titleContainer}>
        <View style={styles.containerspace}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Directory</Text>
        </View>
        <TouchableOpacity
          style={styles.alphabetButton}
          onPress={() => setSearchQuery("")}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#003366" />
          ) : (
            <Ionicons name="refresh-outline" size={20} color="#003366" />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#AAAAAA"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search businesses"
            style={styles.searchInput}
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#003366"
        />
      )}

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        renderItem={({ item }) => (
          <View style={styles.favoriteCard}>
            <View style={styles.favoriteHeader}>
              <View style={styles.businessImageContainer}>
                <View style={styles.businessInitialContainer}>
                  <Text style={styles.businessInitial}>
                    {item.company_name.charAt(0)}
                  </Text>
                </View>
              </View>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{item.company_name}</Text>
                <Text style={styles.businessCategory}>{item.company_type}</Text>
                <Text style={styles.businessAddress}>{item.address}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with a different name
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

// Reuse your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerspace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -0.5,
  },
  alphabetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    fontWeight: "400",
  },
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  businessImageContainer: {
    marginRight: 16,
  },
  businessInitialContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  businessInitial: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  businessInfo: {
    flex: 1,
    paddingRight: 30,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 13,
    color: "#999999",
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
});
