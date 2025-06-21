import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions
} from 'react-native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../config/env";

const { width } = Dimensions.get('window');

const SplashScreen = ({ onConnectionSuccess }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];
    const loadingOpacity = useState(new Animated.Value(0))[0];

    // Theme colors
    const theme = {
        background: isDark ? '#121212' : '#FFFFFF',
        primary: isDark ? '#003366' : '#5D5FEF',
        secondary: isDark ? '#2D2D3A' : '#F3F4F8',
        text: isDark ? '#FFFFFF' : '#2D2D3A',
        subtext: isDark ? '#AAAAAA' : '#71727A',
        error: isDark ? '#FF6B6B' : '#FF4757',
        card: isDark ? '#1E1E2C' : '#FFFFFF',
        border: isDark ? '#2D2D3A' : '#EAEAEA',
    };

    // Function to add emergency businesses to favorites
    const addEmergencyToFavorites = async (companies) => {
        try {
            // Filter companies with "Emergency" category and ensure they're paid
            const emergencyCompanies = companies.filter(
                company => company.company_type === "Emergency" && company.paid === true
            );

            if (emergencyCompanies.length === 0) {
                console.log('No emergency businesses found');
                return;
            }

            // Get existing favorites
            const existingFavoritesJson = await AsyncStorage.getItem('favorites');
            let existingFavorites = existingFavoritesJson ? JSON.parse(existingFavoritesJson) : [];

            // Create a map of existing favorite IDs for quick lookup
            const existingFavoriteIds = new Set(existingFavorites.map(fav => fav._id));

            // Add only emergency companies that aren't already in favorites
            const newEmergencyFavorites = emergencyCompanies.filter(
                company => !existingFavoriteIds.has(company._id)
            );

            if (newEmergencyFavorites.length === 0) {
                console.log('All emergency businesses already in favorites');
                return;
            }

            // Combine existing favorites with new emergency favorites
            const updatedFavorites = [...existingFavorites, ...newEmergencyFavorites];

            // Save updated favorites to AsyncStorage
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            console.log(`Added ${newEmergencyFavorites.length} emergency businesses to favorites`);
        } catch (err) {
            console.error('Error adding emergency businesses to favorites:', err);
        }
    };

    const checkApiConnection = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Start loading animation
            Animated.timing(loadingOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start();

            // Use timeout to prevent infinite hanging if network is totally disconnected
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            try {
                // Check API connection with timeout
                const response = await fetch(`${API_BASE_URL}/api/companies`, {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Server returned status: ${response.status}`);
                }

                // Parse response and store companies in AsyncStorage
                const data = await response.json();
                const timestamp = new Date().toISOString();

                // Store companies in AsyncStorage
                await AsyncStorage.setItem('companies', JSON.stringify(data.companies));
                await AsyncStorage.setItem('companies_timestamp', timestamp);

                // Add emergency businesses to favorites
                await addEmergencyToFavorites(data.companies);

                // If successful, wait a bit to show splash screen then navigate
                setTimeout(() => {
                    setIsLoading(false);
                    onConnectionSuccess();
                }, 2000);
            } catch (fetchError) {
                clearTimeout(timeoutId);

                if (fetchError.name === 'AbortError') {
                    throw new Error('Connection timed out. Please check your internet connection.');
                } else {
                    throw fetchError;
                }
            }
        } catch (err) {
            console.log('API Connection Error:', err.message);
            setError(err.message);
            setIsLoading(false);

            // Fade out loading indicator
            Animated.timing(loadingOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    };

    // Check for network connectivity in general before trying API
    const checkNetworkAndApi = async () => {
        try {
            // We'll use a simple test fetch to determine network connectivity
            try {
                // Try a very fast test fetch to Google's DNS service
                await Promise.race([
                    fetch('https://8.8.8.8', { mode: 'no-cors' }),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 3000)
                    )
                ]);

                // If we get here, there's some internet connectivity, so check the API
                checkApiConnection();
            } catch (networkErr) {
                // If the test fetch fails, we're offline
                setError('No internet connection detected');
                setIsLoading(false);

                // Fade out loading indicator
                Animated.timing(loadingOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            }
        } catch (err) {
            // Catch any other errors
            setError('Something went wrong');
            setIsLoading(false);

            // Fade out loading indicator
            Animated.timing(loadingOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    };

    useEffect(() => {
        // Start entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true
            })
        ]).start();

        // Start network check after animations
        setTimeout(() => {
            checkNetworkAndApi();
        }, 500);
    }, []);

    // Handler for retry button
    const handleRetry = () => {
        // Reset animations
        loadingOpacity.setValue(0);

        // Start loading animation
        Animated.timing(loadingOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();

        checkNetworkAndApi();
    };

    // Handle network settings
    const openNetworkSettings = () => {
        Alert.alert(
            "Network Connection Required",
            "This app requires an internet connection to function properly. Please enable your mobile data or connect to Wi-Fi.",
            [
                { text: "Retry", onPress: handleRetry },
                { text: "OK" }
            ]
        );
    };

    // Handle proceeding in offline mode
    const proceedOffline = async () => {
        try {
            // Check if we have cached companies data
            const cachedCompanies = await AsyncStorage.getItem('companies');

            if (cachedCompanies) {
                // We have cached data, so we can proceed offline
                // Also try to add emergency businesses to favorites from cached data
                try {
                    const companies = JSON.parse(cachedCompanies);
                    // Filter to only include paid companies
                    const paidCompanies = companies.filter(company => company.paid === true);
                    await addEmergencyToFavorites(paidCompanies);
                } catch (err) {
                    console.error('Error processing cached data for emergency favorites:', err);
                }

                Alert.alert(
                    "Offline Mode",
                    "You're entering offline mode. Some features may be limited and data may not be up to date.",
                    [{ text: "Continue", onPress: () => onConnectionSuccess() }]
                );
            } else {
                // No cached data available
                Alert.alert(
                    "No Cached Data",
                    "Cannot proceed offline. No cached data is available. Please connect to the internet first.",
                    [{ text: "OK" }]
                );
            }
        } catch (err) {
            Alert.alert("Error", "Could not check for cached data.");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Background elements */}
            <View style={styles.backgroundElements}>
                <View style={[styles.circle, { backgroundColor: theme.primary + '10', left: -50, top: 100 }]} />
                <View style={[styles.circle, { backgroundColor: theme.primary + '08', right: -70, bottom: 150 }]} />
            </View>

            {/* Logo area */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={[styles.logoWrapper, { backgroundColor: theme.secondary }]}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.appName, { color: theme.text }]}>
                    Business Directory
                </Text>
                <Text style={[styles.tagline, { color: theme.subtext }]}>
                    Connect. Discover. Grow.
                </Text>
            </Animated.View>

            {/* Loading or error state */}
            <View style={styles.statusContainer}>
                {isLoading ? (
                    <Animated.View style={[styles.loadingContainer, { opacity: loadingOpacity }]}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[styles.loadingText, { color: theme.subtext }]}>
                            Retrieving Businesses...
                        </Text>
                    </Animated.View>
                ) : error ? (
                    <Animated.View
                        style={[
                            styles.errorContainer,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                                shadowColor: isDark ? '#000000' : '#CCCCCC',
                            }
                        ]}
                    >
                        <Text style={[styles.errorText, { color: theme.error }]}>
                            Connection Error
                        </Text>
                        <Text style={[styles.errorDetails, { color: theme.subtext }]}>
                            {error}
                        </Text>
                        <Text style={[styles.helpText, { color: theme.text }]}>
                            Try turning on mobile data or connecting to Wi-Fi.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={handleRetry}
                            >
                                <Text style={styles.buttonText}>Retry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary + '90' }]}
                                onPress={openNetworkSettings}
                            >
                                <Text style={styles.buttonText}>Network Help</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.offlineButton, {
                                backgroundColor: 'transparent',
                                borderColor: theme.primary
                            }]}
                            onPress={proceedOffline}
                        >
                            <Text style={[styles.offlineButtonText, { color: theme.primary }]}>
                                Continue in Offline Mode
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : null}
            </View>

            {/* App version at bottom */}
            <Text style={[styles.versionText, { color: theme.subtext }]}>
                Version 1.0.0
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    backgroundElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    circle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    logo: {
        width: 80,
        height: 80,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
    },
    statusContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        width: width * 0.9,
        maxWidth: 400,
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    errorDetails: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    helpText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
        marginHorizontal: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    offlineButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center',
        borderWidth: 1,
    },
    offlineButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        fontSize: 12,
        marginBottom: 16,
    },
});

export default SplashScreen;