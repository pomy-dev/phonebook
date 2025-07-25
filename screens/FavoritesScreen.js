import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    StatusBar,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import connectWhatsApp from "../components/connectWhatsApp";
import connectEmail from "../components/connectEmail";
import findLocation from "../components/findLocation";

export default function FavoritesScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Load favorites from AsyncStorage
    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            } else {
                // Initialize empty array if no favorites exist
                setFavorites([]);
            }
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError('Could not load your favorites. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Remove a favorite
    const removeFavorite = async (businessId) => {
        try {
            // Filter out the business to remove
            const updatedFavorites = favorites.filter(business => business._id !== businessId);

            // Update state
            setFavorites(updatedFavorites);

            // Save to AsyncStorage
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            // Show success message
            Alert.alert('Success', 'Business removed from favorites');
        } catch (err) {
            console.error('Error removing favorite:', err);
            Alert.alert('Error', 'Could not remove from favorites. Please try again.');

            // Reload favorites to ensure UI is in sync with storage
            loadFavorites();
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    };

    // Handle call action
    const handleCall = (phoneNumbers, e) => {
        if (e) {
            e.stopPropagation();
        }

        if (!phoneNumbers || phoneNumbers.length === 0) {
            Alert.alert('No Phone Number', 'This business has no phone number listed.');
            return;
        }

        if (phoneNumbers.length === 1) {
            Alert.alert(
                "Call Business",
                `Would you like to call ${phoneNumbers[0].number}?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Call", onPress: () => Linking.openURL(`tel:${phoneNumbers[0].number}`) }
                ]
            );
        } else {
            const options = phoneNumbers.map((phone) => ({
                text: `${phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)}: ${phone.number}`,
                onPress: () => Linking.openURL(`tel:${phone.number}`),
            }));

            options.push({ text: "Cancel", style: "cancel" });
            Alert.alert("Select Phone Number", "Choose a number to call", options);
        }
    };

    // Handle WhatsApp
    const handleWhatsapp = (phones, e) => {
        if (e) {
            e.stopPropagation();
        }

        if (!phones || phones.length === 0) {
            Alert.alert('No WhatsApp', 'This business has no WhatsApp number listed.');
            return;
        }

        for (let i = 0; i < phones.length; i++) {
            if (phones[i].phone_type == "whatsapp") {
                connectWhatsApp(phones[i].number);
                return;
            } else {
                Alert.alert('No WhatsApp', 'This business has no WhatsApp number listed.');
            }
        }
    };

    // Handle Email
    const handleEmail = (email, e) => {
        if (e) {
            e.stopPropagation();
        }
        connectEmail(email);
    };

    // Handle Location
    const handleLocation = (address, e) => {
        if (e) {
            e.stopPropagation();
        }
        findLocation(address);
    };

    // Load favorites on component mount
    useEffect(() => {
        loadFavorites();

        // Add a listener for when the screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavorites();
        });

        // Clean up the listener
        return unsubscribe;
    }, [navigation]);

    // Render each favorite business item
    const renderFavoriteItem = ({ item }) => (
        <View style={styles.favoriteCard}>
            <View style={styles.favoriteHeader}>
                <View style={styles.businessImageContainer}>
                    {item.logo ? (
                        <Image source={{ uri: item.logo }} style={styles.businessImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.businessInitialContainer}>
                            <Text style={styles.businessInitial}>{item.company_name.charAt(0)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.businessInfo}>
                    <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">{item.company_name}</Text>
                    <Text style={styles.businessCategory} numberOfLines={1} ellipsizeMode="tail">{item.company_type}</Text>
                    <Text style={styles.businessAddress} numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                        Alert.alert(
                            "Remove Favorite",
                            `Are you sure you want to remove ${item.company_name} from favorites?`,
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Remove", onPress: () => removeFavorite(item._id) }
                            ]
                        );
                    }}
                >
                    <Ionicons name="heart" size={22} color="#003366" />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => handleCall(item.phone, e)}
                >
                    <Ionicons name="call-outline" size={18} color="#003366" />
                    <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>

                {item.phone && item.phone.some(p => p.phone_type === 'whatsApp') && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleWhatsapp(item.phone);
                        }}
                    >
                        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                        <Text style={styles.actionButtonText}>WhatsApp</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => handleEmail(item.email, e)}
                >
                    <Ionicons name="mail-outline" size={18} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => handleLocation(item.address, e)}
                >
                    <Ionicons name="location-outline" size={18} color="#5856D6" />
                    <Text style={styles.actionButtonText}>Map</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => navigation.navigate("BusinessDetail", { business: item })}
            >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#003366" />
            </TouchableOpacity>
        </View>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#DDDDDD" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptySubtitle}>
                Add businesses to your favorites for quick access
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.browseButtonText}>Browse Businesses</Text>
            </TouchableOpacity>
        </View>
    );

    // Render error state
    const renderErrorState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
            <Text style={styles.errorTitle}>Something Went Wrong</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={loadFavorites}
            >
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorites</Text>
                {favorites.length > 0 && (
                    <Text style={styles.favoriteCount}>{favorites.length} {favorites.length === 1 ? 'business' : 'businesses'}</Text>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003366" />
                    <Text style={styles.loadingText}>Loading your favorites...</Text>
                </View>
            ) : error ? (
                renderErrorState()
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item._id}
                    renderItem={renderFavoriteItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        letterSpacing: -0.5,
    },
    favoriteCount: {
        fontSize: 14,
        color: '#777777',
        marginTop: 4,
    },
    listContainer: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    favoriteCard: {
        backgroundColor: '#FFFFFF',
        // borderRadius: 16,
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
    removeButton: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginTop: 24,
        marginBottom: 8,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF3B30',
        marginTop: 24,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#777777',
        textAlign: 'center',
        marginBottom: 32,
    },
    browseButton: {
        backgroundColor: '#003366',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    browseButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    retryButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#777777',
        marginTop: 16,
    },
});