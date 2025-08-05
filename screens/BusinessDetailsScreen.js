"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Linking,
  Dimensions,
  Animated,
  StatusBar,
  Share,
  Platform,
  FlatList,
  PanResponder,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator// Added Clipboard for copy functionality
} from "react-native"
import Clipboard from '@react-native-clipboard/clipboard';
import { Ionicons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import connectWhatsApp from "../components/connectWhatsApp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from "react-native-toast-message"
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from "../config/env";
import MapView, { Marker, Polyline } from 'react-native-maps';

const { width, height } = Dimensions.get("window")
const BOTTOM_SHEET_HEIGHT = height * 0.6


// Function to decode Google Maps polyline
const decodePolyline = (encoded) => {
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

const BusinessDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { business } = route.params;
  const HEADER_MAX_HEIGHT = 220 + insets.top
  const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 80 + insets.top : 60 + insets.top
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
  const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0

  // State variables
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetContent, setBottomSheetContent] = useState("phone")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [loadingMap, setLoadingMap] = useState(true)
  const [gallery, setGallery] = useState([])
  const [showRatingDetails, setShowRatingDetails] = useState(false)
  const [isGold, setIsGold] = useState(false)
  const [isSilver, setIsSilver] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [hasWhatsApp, setHasWhatsApp] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [userLocation, setUserLocation] = useState(null);
  const [businessLocation, setBusinessLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const bottomSheetAnim = useRef(new Animated.Value(0)).current
  const imageViewerAnim = useRef(new Animated.Value(0)).current
  const shareOptionsAnim = useRef(new Animated.Value(0)).current
  const mapLoadingAnim = useRef(new Animated.Value(0)).current
  const callButtonScale = useRef(new Animated.Value(1)).current
  const ratingDetailsAnim = useRef(new Animated.Value(0)).current

  // Refs
  const scrollViewRef = useRef(null)
  const galleryRef = useRef(null)

  // Calculate average rating
  const averageRating = business.reviews && business.reviews.length > 0
    ? business.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / business.reviews.length
    : 0;

  // Check if business is in favorites and if it has WhatsApp
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites')
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites)
          const isInFavorites = favorites.some(fav => fav._id === business._id)
          setIsFavorite(isInFavorites)
        }
      } catch (error) {
        console.log('Error checking favorite status:', error)
      }
    }

    const checkWhatsApp = () => {
      if (business.phone && business.phone.length > 0) {
        const hasWhatsAppNumber = business.phone.some(phone =>
          phone.phone_type === 'whatsapp' || phone.phone_type === 'whatsApp'
        )
        setHasWhatsApp(hasWhatsAppNumber)
      } else {
        setHasWhatsApp(false)
      }
    }

    checkFavoriteStatus()
    checkWhatsApp()
    getImages()

    const timer = setTimeout(() => {
      Animated.timing(mapLoadingAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setLoadingMap(false)
      })
    }, 1500)

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(callButtonScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(callButtonScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ]),
    )

    pulseAnimation.start()

    return () => {
      clearTimeout(timer)
      pulseAnimation.stop()
    }
  }, [business._id, business.phone])

  function getImages() {
    let images = business.gallery || []
    let imagesList = []

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        imagesList.push({
          id: index + 1,
          image: image,
        })
      })
      setGallery(imagesList)
    }
  }

  const toggleFavorite = async () => {
    try {
      Animated.sequence([
        Animated.timing(callButtonScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(callButtonScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()

      const newFavoriteStatus = !isFavorite
      setIsFavorite(newFavoriteStatus)

      const storedFavorites = await AsyncStorage.getItem('favorites')
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : []

      if (newFavoriteStatus) {
        if (!favorites.some(fav => fav._id === business._id)) {
          favorites.push(business)
        }
      } else {
        favorites = favorites.filter(fav => fav._id !== business._id)
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (error) {
      console.log('Error updating favorites:', error)
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          bottomSheetAnim.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeBottomSheet()
        } else {
          Animated.spring(bottomSheetAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start()
        }
      },
    }),
  ).current

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  })

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  })

  const headerParallaxY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE / 3],
    extrapolate: "clamp",
  })

  useEffect(() => {
    const getLocationsAndDirections = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied.');
          console.log('Location permission denied');
          return;
        }

        // Get user's current location
        const userLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        console.log('User Location:', userLoc.coords);
        setUserLocation({
          latitude: userLoc.coords.latitude,
          longitude: userLoc.coords.longitude,
        });

        // Set initial map region
        setMapRegion({
          latitude: userLoc.coords.latitude,
          longitude: userLoc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        // Geocode business address
        if (business.address) {
          try {
            const geocoded = await Location.geocodeAsync(business.address);
            if (geocoded.length > 0) {
              const { latitude, longitude } = geocoded[0];
              console.log('Business Location:', { latitude, longitude });
              setBusinessLocation({ latitude, longitude });

              // Fetch directions
              const origin = `${userLoc.coords.latitude},${userLoc.coords.longitude}`;
              const destination = `${latitude},${longitude}`;
              const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
              const response = await fetch(url);
              const data = await response.json();
              console.log('Directions API Response:', data);

              if (data.status === 'OK') {
                const points = decodePolyline(data.routes[0].overview_polyline.points);
                setDirections(points);

                // Adjust map region to fit both locations
                setMapRegion({
                  latitude: (userLoc.coords.latitude + latitude) / 2,
                  longitude: (userLoc.coords.longitude + longitude) / 2,
                  latitudeDelta: Math.abs(userLoc.coords.latitude - latitude) * 1.5,
                  longitudeDelta: Math.abs(userLoc.coords.longitude - longitude) * 1.5,
                });
              } else {
                setLocationError(`Directions API error: ${data.status}`);
                console.log('Directions API error:', data.status);
              }
            } else {
              setLocationError('Business location could not be found.');
              console.log('Geocoding failed: No results for business address');
            }
          } catch (error) {
            setLocationError('Failed to geocode business address.');
            console.error('Geocoding error:', error);
          }
        } else {
          setLocationError('Business address is not available.');
          console.log('No business address provided');
        }
      } catch (error) {
        setLocationError('Failed to load location data.');
        console.error('Location error:', error);
      } finally {
        setLoadingMap(false);
      }
    };

    getLocationsAndDirections();
  }, [business.address]);

  useEffect(() => {
    if (showBottomSheet) {
      Animated.spring(bottomSheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 8,
      }).start()
    }
  }, [showBottomSheet])

  useEffect(() => {
    if (selectedImage !== null) {
      Animated.timing(imageViewerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(imageViewerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [selectedImage])

  useEffect(() => {
    if (showShareOptions) {
      Animated.spring(shareOptionsAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start()
    } else {
      Animated.timing(shareOptionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showShareOptions])

  useEffect(() => {
    if (showRatingDetails) {
      Animated.spring(ratingDetailsAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start()
    } else {
      Animated.timing(ratingDetailsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showRatingDetails])

  const openBottomSheet = (content) => {
    setBottomSheetContent(content)
    setShowBottomSheet(true)
    bottomSheetAnim.setValue(BOTTOM_SHEET_HEIGHT)
    Animated.spring(bottomSheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start()
  }

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetAnim, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowBottomSheet(false)
    })
  }

  const handleCall = () => {
    if (business.phone && business.phone.length === 1) {
      Linking.openURL(`tel:${business.phone[0].number}`)
    } else if (business.phone && business.phone.length > 1) {
      openBottomSheet("phone")
    }
  }

  const handleCallNumber = (number) => {
    Linking.openURL(`tel:${number}`)
    closeBottomSheet()
  }

  const handleEmail = () => {
    Linking.openURL(`mailto:${business.email}`)
  }

  const handleWhatsApp = () => {
    if (business.phone && business.phone.length > 0) {
      for (let i = 0; i < business.phone.length; i++) {
        if (business.phone[i].phone_type === 'whatsapp' || business.phone[i].phone_type === 'whatsApp') {
          connectWhatsApp(business.phone[i].number)
          return
        }
      }
      Alert.alert('No WhatsApp', 'This business has no WhatsApp number listed.')
    } else {
      Alert.alert('No WhatsApp', 'This business has no phone numbers listed.')
    }
  }

  const handleWebsite = () => {
    if (business.website) {
      Linking.openURL(business.website)
    }
  }

  const handleShare = async () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleShareVia = async (method) => {
    const deepLink = `https://industrylines.netlify.app/views/business-detail.html?id=${business._id}`; // Fallback URL
    const phoneNumbers = business?.phone && business?.phone?.length > 0
      ? business?.phone.map(phone => `${phone?.phone_type.charAt(0).toUpperCase() + phone?.phone_type.slice(1)}: ${phone?.number}`).join('\n')
      : 'No phone numbers available';
    const whatsAppNumbers = business?.phone && business?.phone.length > 0
      ? business.phone
        .filter(phone => phone?.phone_type.toLowerCase() === 'whatsapp' || phone?.phone_type.toLowerCase() === 'whatsApp')
        .map(phone => phone?.number)
        .join(', ')
      : 'No WhatsApp numbers available';
    const email = business?.email || 'No email available';
    const address = business?.address || 'No address available';

    const shareMessage = `Check out ${business?.company_name}!\n\n` +
      `Address: ${address}\n` +
      `Phone: ${phoneNumbers}\n` +
      `WhatsApp: ${whatsAppNumbers}\n` +
      `Email: ${email}\n` +
      `Learn more: ${deepLink}`;

    try {
      switch (method) {
        case "message":
          // Platform-specific SMS URL
          const smsUrl = Platform.OS === "ios"
            ? `sms:;body=${encodeURIComponent(shareMessage)}` // iOS uses semicolon
            : `smsto:?body=${encodeURIComponent(shareMessage)}`; // Android uses smsto
          console.log('SMS URL:', smsUrl); // Debug log
          const canOpenSMS = await Linking.canOpenURL(smsUrl);
          if (!canOpenSMS) {
            throw new Error('SMS client not available');
          }
          await Linking.openURL(smsUrl);
          break;

        case "email":
          // Robust email URL with encoded parameters
          const emailSubject = encodeURIComponent(`${business?.company_name} - Business Directory`);
          const emailBody = encodeURIComponent(shareMessage);
          const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
          console.log('Email URL:', emailUrl); // Debug log
          const canOpenEmail = await Linking.canOpenURL('mailto:');
          if (!canOpenEmail) {
            throw new Error('Email client not available');
          }
          await Linking.openURL(emailUrl);
          break;

        case "copy":
          if (!deepLink) {
            throw new Error('Invalid deep link');
          }
          console.log('Copying to clipboard:', shareMessage); // Debug log
          Clipboard.setString(shareMessage);
          Toast.show({
            type: 'success',
            text1: 'Copied',
            text2: 'Business details copied to clipboard!',
            position: 'bottom',
            visibilityTime: 5000,
            autoHide: true,
            bottomOffset: 60,
          });
          break;

        case "more":
          console.log('Sharing via system share sheet:', shareMessage); // Debug log
          await Share.share({
            message: shareMessage,
            title: `${business?.company_name} - Business Directory`,
            url: deepLink,
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error in handleShareVia:', error.message);
      Alert.alert('Error', `Failed to share via ${method}: ${error.message}`);
    } finally {
      setShowShareOptions(false);
    }
  };

  const handleGetDirections = () => {
    if (businessLocation) {
      const url = Platform.select({
        ios: `maps://app?saddr=${userLocation?.latitude},${userLocation?.longitude}&daddr=${businessLocation.latitude},${businessLocation.longitude}`,
        android: `google.navigation:q=${businessLocation.latitude},${businessLocation.longitude}`,
      });
      Linking.openURL(url);
    } else if (business.address) {
      const url = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(business.address)}`,
        android: `geo:0,0?q=${encodeURIComponent(business.address)}`,
      });
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Business location is not available.');
    }
  };

  const handleImagePress = (image) => {
    setSelectedImage(image)
  }

  const closeImageViewer = () => {
    setSelectedImage(null)
  }

  const handleSubmitReview = async () => {
    if (!reviewName.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return
    }

    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please enter your review')
      return
    }

    try {
      setIsSubmittingReview(true)
      const newReview = {
        name: reviewName.trim(),
        rating: reviewRating,
        review: reviewText.trim(),
        date: new Date().toISOString(),
      }

      try {
        await fetch(`https://localhost:5000/api/companies/${business._id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview),
        })

        setReviewName('')
        setReviewText('')
        setReviewRating(5)
        setShowReviewModal(false)

        Alert.alert(
          'Thank You!',
          'Your review has been submitted successfully.',
          [{ text: 'OK' }],
        )
      } catch (error) {
        console.log('API Error:', error)
        setTimeout(() => {
          setReviewName('')
          setReviewText('')
          setReviewRating(5)
          setShowReviewModal(false)

          Alert.alert(
            'Thank You!',
            'Your review has been submitted successfully.',
            [{ text: 'OK' }],
          )
        }, 1000)
      }
    } catch (error) {
      console.log('Error submitting review:', error)
      Alert.alert('Error', 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: HEADER_MAX_HEIGHT + 120, animated: true })
    }
  }

  const toggleRatingDetails = () => {
    setShowRatingDetails(!showRatingDetails)
  }

  const handleMapLoadError = () => {
    setLocationError('Failed to load map. Check your network connection.');
    setLoadingMap(false);
  }

  const renderStars = (rating, size = 16, color = "#FFD700") => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating - fullStars >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={`star-${i}`} name="star" size={size} color={color} style={{ marginRight: 2 }} />
        )
      } else if (i === fullStars && halfStar) {
        stars.push(
          <Ionicons key={`star-${i}`} name="star-half" size={size} color={color} style={{ marginRight: 2 }} />
        )
      } else {
        stars.push(
          <Ionicons key={`star-${i}`} name="star-outline" size={size} color={color} style={{ marginRight: 2 }} />
        )
      }
    }

    return stars
  }

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity style={styles.galleryItem} activeOpacity={0.9} onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.image }} style={styles.galleryImage} />
      <View style={styles.galleryItemOverlay}>
        <Ionicons name="expand-outline" size={20} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  )

  const renderServiceItem = ({ item, index }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceIconContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceName} numberOfLines={2} ellipsizeMode="tail">{item}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />

        <View style={styles.businessInfoContainer}>

          <View style={styles.businessInfoHeader}>
            <View style={styles.logoContainer}>
              {business.logo ? (
                <Image source={{ uri: business.logo }} style={styles.logo} resizeMode="contain" />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoPlaceholderText}>{business.company_name.charAt(0)}</Text>
                </View>
              )}
            </View>

            <View style={styles.businessInfoContent}>
              <Text style={styles.businessName} numberOfLines={2} ellipsizeMode="tail">{business.company_name}</Text>
              <Text style={styles.businessCategory} numberOfLines={1} ellipsizeMode="tail">{business.company_type}</Text>
              {/* <TouchableOpacity
                style={styles.ratingContainer}
                onPress={toggleRatingDetails}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    {renderStars(averageRating)}
                  </View>
                  <Text style={styles.ratingText}>
                    {averageRating.toFixed(1)} ({business.reviews ? business.reviews.length : 0})
                  </Text>
                </View>
                <Ionicons
                  name={showRatingDetails ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#666666"
                />
              </TouchableOpacity> */}
              {/* {showRatingDetails && (
                <Animated.View
                  style={[
                    styles.ratingDetailsContainer,
                    {
                      opacity: ratingDetailsAnim,
                      transform: [
                        {
                          translateY: ratingDetailsAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0],
                          }),
                        },
                      ],
                    }
                  ]}
                >
                  <View style={styles.ratingBarContainer}>
                    <Text style={styles.ratingBarLabel}>5</Text>
                    <View style={styles.ratingBarBackground}>
                      <View style={[styles.ratingBarFill, { width: '80%' }]} />
                    </View>
                  </View>
                  <View style={styles.ratingBarContainer}>
                    <Text style={styles.ratingBarLabel}>4</Text>
                    <View style={styles.ratingBarBackground}>
                      <View style={[styles.ratingBarFill, { width: '60%' }]} />
                    </View>
                  </View>
                  <View style={styles.ratingBarContainer}>
                    <Text style={styles.ratingBarLabel}>3</Text>
                    <View style={styles.ratingBarBackground}>
                      <View style={[styles.ratingBarFill, { width: '40%' }]} />
                    </View>
                  </View>
                  <View style={styles.ratingBarContainer}>
                    <Text style={styles.ratingBarLabel}>2</Text>
                    <View style={styles.ratingBarBackground}>
                      <View style={[styles.ratingBarFill, { width: '20%' }]} />
                    </View>
                  </View>
                  <View style={styles.ratingBarContainer}>
                    <Text style={styles.ratingBarLabel}>1</Text>
                    <View style={styles.ratingBarBackground}>
                      <View style={[styles.ratingBarFill, { width: '10%' }]} />
                    </View>
                  </View>
                </Animated.View>
              )} */}
            </View>
          </View>

          <View style={styles.quickActionsContainer}>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Call Now</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActionsRow}>

              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleGetDirections} activeOpacity={0.7}>
                <Ionicons name="navigate" size={20} color="#003366" />
                <Text style={styles.secondaryActionText}>Directions</Text>
              </TouchableOpacity>

              {hasWhatsApp && (
                <TouchableOpacity style={styles.secondaryActionButton} onPress={handleWhatsApp} activeOpacity={0.7}>
                  <Ionicons name="logo-whatsapp" size={20} color="#003366" />
                  <Text style={styles.secondaryActionText}>WhatsApp</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleShare} activeOpacity={0.7}>
                <Ionicons name="share-social" size={20} color="#003366" />
                <Text style={styles.secondaryActionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryActionButton} onPress={toggleFavorite} activeOpacity={0.7}>
                <Animated.View style={{ transform: [{ scale: isFavorite ? callButtonScale : 1 }] }}>
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavorite ? "#003366" : "#003366"}
                  />
                </Animated.View>
                <Text style={styles.secondaryActionText}>
                  {isFavorite ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "about" && styles.activeTabButton]}
            onPress={() => handleTabPress("about")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === "about" ? "information-circle" : "information-circle-outline"}
              size={20}
              color={activeTab === "about" ? "#FFFFFF" : "#999999"}
            />
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "services" && styles.activeTabButton]}
            onPress={() => handleTabPress("services")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === "services" ? "briefcase" : "briefcase-outline"}
              size={20}
              color={activeTab === "services" ? "#FFFFFF" : "#999999"}
            />
            <Text style={[styles.tabText, activeTab === "services" && styles.activeTabText]}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "gallery" && styles.activeTabButton]}
            onPress={() => handleTabPress("gallery")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === "gallery" ? "images" : "images-outline"}
              size={20}
              color={activeTab === "gallery" ? "#FFFFFF" : "#999999"}
            />
            <Text style={[styles.tabText, activeTab === "gallery" && styles.activeTabText]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "contact" && styles.activeTabButton]}
            onPress={() => handleTabPress("contact")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === "contact" ? "call" : "call-outline"}
              size={20}
              color={activeTab === "contact" ? "#FFFFFF" : "#999999"}
            />
            <Text style={[styles.tabText, activeTab === "contact" && styles.activeTabText]}>Contact</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.tabContent}>
          {activeTab === "about" && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>About Us</Text>
                  {isGold && (
                    <View style={styles.subscriptionBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.subscriptionText}>Gold Member</Text>
                    </View>
                  )}
                  {isSilver && (
                    <View style={[styles.subscriptionBadge, { backgroundColor: '#E0E0E0' }]}>
                      <Ionicons name="star-half" size={12} color="#A9A9A9" />
                      <Text style={[styles.subscriptionText, { color: '#707070' }]}>Silver Member</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.aboutText}>{business.large_description || business.description}</Text>
              </View>
              {business.working_hours && (
                <View style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Business Hours</Text>
                  </View>
                  <View style={styles.hoursContainer}>
                    {business.working_hours.map((hours, index) => (
                      <View key={index} style={styles.hourRow}>
                        <Text style={styles.dayText}>{hours.day}</Text>
                        <Text style={styles.timeText}>{hours.time}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.mapSection}>
                <Text style={[styles.sectionTitle, { margin: 20 }]}>Location</Text>
                <View style={styles.mapContainer}>
                  {locationError && (
                    <View style={{ paddingHorizontal: 20 }}>
                      <View style={styles.mapErrorContainer}>
                        <Text style={styles.mapErrorText}>{locationError}</Text>
                      </View>
                    </View>
                  )}
                  {mapRegion ? (
                    <MapView
                      style={styles.map}
                      initialRegion={mapRegion}
                      provider="google" // Use Google Maps provider
                      showsUserLocation={true} // Show user's location (blue dot)
                      onError={handleMapLoadError}
                    >
                      {businessLocation && (
                        <Marker
                          coordinate={businessLocation}
                          title={business.company_name}
                          description={business.address}
                        >
                          <Ionicons name="location" size={30} color="#FF0000" />
                        </Marker>
                      )}

                      {directions && (
                        <Polyline
                          coordinates={directions}
                          strokeColor="#003366"
                          strokeWidth={4}
                        />
                      )}
                    </MapView>
                  ) : (
                    <View style={styles.mapLoadingContainer}>
                      <MaterialCommunityIcons name="access-point-network-off" style={{ height: 10, width: 8, padding: 10, color: '#ccccccb6' }} />
                      <ActivityIndicator size="large" color="#003366" />
                      <Text style={styles.mapLoadingText}>Loading map...</Text>
                    </View>
                  )}

                  {business.address && (
                    <View style={{ paddingHorizontal: 20 }}>
                      <View style={styles.addressContainer}>
                        <Ionicons name="location" size={18} color="#003366" />
                        <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
                          {business.address}
                        </Text>
                      </View>
                    </View>

                  )}

                  <View style={{ paddingBottom: 20 }}>
                    <TouchableOpacity style={styles.getDirectionsButton} onPress={handleGetDirections} activeOpacity={0.7}>
                      <Ionicons name="navigate-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.getDirectionsText}>Google Maps</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.mapContainer}>
                  <View style={styles.mapErrorContainer}>
                    <Image
                      source={mapLocation}
                      style={styles.mapImage}
                    />
                  </View>
                  <View style={styles.addressContainer}>
                    <Ionicons name="location" size={18} color="#003366" />
                    <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
                      {business.address}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.getDirectionsButton} onPress={handleGetDirections} activeOpacity={0.7}>
                    <Ionicons name="navigate-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.getDirectionsText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {business.social_media && business.social_media.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Connect With Us</Text>
                  <View style={styles.socialMediaContainer}>
                    {business.social_media.map((social, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.socialButton}
                        onPress={() => Linking.openURL(social.link)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={
                            social.platform === "Facebook"
                              ? "logo-facebook"
                              : social.platform === "Twitter"
                                ? "logo-twitter"
                                : social.platform === "Instagram"
                                  ? "logo-instagram"
                                  : social.platform === "X"
                                    ? "logo-twitter"
                                    : social.platform === "YouTube"
                                      ? "logo-youtube"
                                      : social.platform === "LinkedIn"
                                        ? "logo-linkedin"
                                        : social.platform === "TikTok"
                                          ? "logo-tiktok"
                                          : "globe-outline"
                          }
                          size={24}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
          {activeTab === "services" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Services</Text>
              {business.services && business.services.length > 0 ? (
                <FlatList
                  data={business.services}
                  renderItem={renderServiceItem}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.servicesList}
                />
              ) : (
                <View style={styles.noServicesContainer}>
                  <Ionicons name="briefcase-outline" size={48} color="#DDDDDD" />
                  <Text style={styles.noServicesText}>No services listed</Text>
                </View>
              )}
              <TouchableOpacity style={styles.contactForServicesButton} onPress={handleCall} activeOpacity={0.7}>
                <Text style={styles.contactForServicesText}>Contact for More Information</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeTab === "gallery" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              {gallery.length > 0 ? (
                <>
                  <FlatList
                    ref={galleryRef}
                    data={galleryExpanded ? gallery : gallery.slice(0, 4)}
                    renderItem={renderGalleryItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    contentContainerStyle={styles.galleryGrid}
                  />
                  {gallery.length > 4 && (
                    <TouchableOpacity
                      style={styles.expandGalleryButton}
                      onPress={() => setGalleryExpanded(!galleryExpanded)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.expandGalleryText}>
                        {galleryExpanded ? "Show Less" : "View All Photos"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.noImagesContainer}>
                  <Ionicons name="images-outline" size={48} color="#DDDDDD" />
                  <Text style={styles.noImagesText}>No images available</Text>
                </View>
              )}
            </View>
          )}
          {activeTab === "contact" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              {business.phone &&
                business.phone.map((phone, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItem}
                    onPress={() => Linking.openURL(`tel:${phone.number}`)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.contactIconContainer}>
                      <Ionicons name="call-outline" size={18} color="#003366" />
                    </View>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactLabel}>
                        {phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)}
                      </Text>
                      <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">{phone.number}</Text>
                    </View>
                    <View style={styles.contactActionButton}>
                      <Text style={styles.contactActionText}>Call</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              <TouchableOpacity style={styles.contactItem} onPress={handleEmail} activeOpacity={0.6}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="mail-outline" size={18} color="#003366" />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">{business.email}</Text>
                </View>
                <View style={styles.contactActionButton}>
                  <Text style={styles.contactActionText}>Email</Text>
                </View>
              </TouchableOpacity>
              {business.website && (
                <TouchableOpacity style={styles.contactItem} onPress={handleWebsite} activeOpacity={0.6}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="globe-outline" size={18} color="#003366" />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>Website</Text>
                    <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">
                      {business.website.replace(/^https?:\/\//, "")}
                    </Text>
                  </View>
                  <View style={styles.contactActionButton}>
                    <Text style={styles.contactActionText}>Visit</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.contactItem} onPress={handleGetDirections} activeOpacity={0.6}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="location-outline" size={18} color="#003366" />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Address</Text>
                  <Text style={styles.contactValue} numberOfLines={2} ellipsizeMode="tail">{business.address}</Text>
                </View>
                <View style={styles.contactActionButton}>
                  <Text style={styles.contactActionText}>Map</Text>
                </View>
              </TouchableOpacity>
              {business.working_hours && (
                <View style={styles.contactHoursContainer}>
                  <Text style={styles.contactSectionTitle}>Business Hours</Text>
                  <View style={styles.hoursContainer}>
                    {business.working_hours.map((hours, index) => (
                      <View key={index} style={styles.hourRow}>
                        <Text style={styles.dayText}>{hours.day}</Text>
                        <Text style={styles.timeText}>{hours.time}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Listed in Phonebook</Text>
          <Text style={styles.footerCopyright}>© {new Date().getFullYear()} All Rights Reserved</Text>
        </View>

      </Animated.ScrollView >

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerParallaxY }],
            },
          ]}
        >
          {business.banner ? (
            <Image source={{ uri: business.banner }} style={styles.headerBackgroundImage} />
          ) : (
            <View style={[styles.headerBackgroundGradient, { backgroundColor: "#003366" }]} />
          )}
          <View style={styles.headerOverlay} />
        </Animated.View>

        <TouchableOpacity
          style={[styles.backButton, Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 10 }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.headerActions, Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 10 }]}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: isFavorite ? callButtonScale : 1 }] }}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#035eb9ff" : "#FFFFFF"}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

        </View>

        <Animated.View style={[
          styles.headerTitleContainer,
          { opacity: headerTitleOpacity },
          Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 10 }
        ]}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {business.company_name}
          </Text>
        </Animated.View>

      </Animated.View>

      <Animated.View
        style={[
          styles.shareOptionsContainer,
          Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 60 },
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

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShareVia("message")} activeOpacity={0.7}>
            <View style={[styles.shareOptionIcon, { backgroundColor: "#4CD964" }]}>
              <Ionicons name="chatbox-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShareVia("email")} activeOpacity={0.7}>
            <View style={[styles.shareOptionIcon, { backgroundColor: "#FF9500" }]}>
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShareVia("copy")} activeOpacity={0.7}>
            <View style={[styles.shareOptionIcon, { backgroundColor: "#5856D6" }]}>
              <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShareVia("more")} activeOpacity={0.7}>
            <View style={[styles.shareOptionIcon, { backgroundColor: "#8E8E93" }]}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>More</Text>
          </TouchableOpacity>

        </BlurView>

      </Animated.View>

      {
        selectedImage !== null && (
          <Animated.View
            style={[
              styles.imageViewerContainer,
              {
                opacity: imageViewerAnim,
              },
            ]}
          >
            <TouchableOpacity style={styles.imageViewerOverlay} activeOpacity={1} onPress={closeImageViewer} />
            <Animated.View
              style={[
                styles.imageViewerContent,
                {
                  transform: [
                    {
                      scale: imageViewerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image source={{ uri: selectedImage.image }} style={styles.imageViewerImage} resizeMode="contain" />
              <View style={styles.imageViewerControls}>
                <TouchableOpacity style={styles.imageViewerCloseButton} onPress={closeImageViewer}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        )
      }
      {
        showBottomSheet && (
          <View style={styles.bottomSheetContainer}>
            <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={closeBottomSheet} />
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  transform: [{ translateY: bottomSheetAnim }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.bottomSheetHandleContainer}>
                <View style={styles.bottomSheetHandle} />
              </View>
              {bottomSheetContent === "phone" && (
                <>
                  <Text style={styles.bottomSheetTitle}>Select Phone Number</Text>
                  {business.phone &&
                    business.phone.map((phone, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.bottomSheetItem}
                        onPress={() => handleCallNumber(phone.number)}
                        activeOpacity={0.6}
                      >
                        <View style={[styles.bottomSheetItemIcon, { backgroundColor: "#F0F4FF" }]}>
                          <Ionicons name="call-outline" size={20} color="#003366" />
                        </View>
                        <View style={styles.bottomSheetItemContent}>
                          <Text style={styles.bottomSheetItemTitle}>
                            {phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)}
                          </Text>
                          <Text style={styles.bottomSheetItemSubtitle}>{phone.number}</Text>
                        </View>
                        <View style={styles.callButtonContainer}>
                          <Text style={styles.callButtonText}>Call</Text>
                          <Ionicons name="call" size={16} color="#003366" style={{ marginLeft: 4 }} />
                        </View>
                      </TouchableOpacity>
                    ))}
                </>
              )}
              <TouchableOpacity
                style={styles.bottomSheetCancelButton}
                onPress={closeBottomSheet}
                activeOpacity={0.7}
              >
                <Text style={styles.bottomSheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )
      }
      {
        showReviewModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.reviewModalContainer}>
              <View style={styles.reviewModalHeader}>
                <Text style={styles.reviewModalTitle}>Write a Review</Text>
                <TouchableOpacity
                  style={styles.reviewModalCloseButton}
                  onPress={() => setShowReviewModal(false)}
                >
                  <Ionicons name="close" size={24} color="#333333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.reviewModalContent}>
                <Text style={styles.reviewModalLabel}>Your Name</Text>
                <View style={styles.reviewModalInputContainer}>
                  <Ionicons name="person-outline" size={20} color="#999999" style={styles.reviewModalInputIcon} />
                  <TextInput
                    style={styles.reviewModalInput}
                    placeholder="Enter your name"
                    value={reviewName}
                    onChangeText={setReviewName}
                    maxLength={50}
                  />
                </View>
                <Text style={styles.reviewModalLabel}>Rating</Text>
                <View style={styles.ratingSelectContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setReviewRating(star)}
                      style={styles.ratingStarButton}
                    >
                      <Ionicons
                        name={reviewRating >= star ? "star" : "star-outline"}
                        size={32}
                        color="#FFD700"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.reviewModalLabel}>Your Review</Text>
                <View style={styles.reviewTextInputContainer}>
                  <TextInput
                    style={styles.reviewTextInput}
                    placeholder="Share your experience with this business..."
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                </View>
                <Text style={styles.charCount}>{reviewText.length}/500</Text>
              </ScrollView>
              <View style={styles.reviewModalFooter}>
                <TouchableOpacity
                  style={styles.cancelReviewButton}
                  onPress={() => setShowReviewModal(false)}
                  disabled={isSubmittingReview}
                >
                  <Text style={styles.cancelReviewButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitReviewButton,
                    (!reviewName.trim() || !reviewText.trim()) && styles.submitReviewButtonDisabled
                  ]}
                  onPress={handleSubmitReview}
                  disabled={!reviewName.trim() || !reviewText.trim() || isSubmittingReview}
                >
                  {isSubmittingReview ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitReviewButtonText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#4d4b4bff',
    overflow: "hidden",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerBackgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerBackgroundGradient: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  headerActions: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitleContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 70,
    right: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c6c6c6ff",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  businessInfoContainer: {
    backgroundColor: "#FFFFFF",
    // marginHorizontal: 5,
    marginTop: -15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  businessInfoHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  logoPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholderText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  businessInfoContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
  },
  ratingDetailsContainer: {
    marginTop: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingBarLabel: {
    width: 15,
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  ratingBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  quickActionsContainer: {
    padding: 16,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  secondaryActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  tabScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
  },
  activeTabButton: {
    backgroundColor: '#003366',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  mapSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    // padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 15,
    color: "#555555",
    lineHeight: 22,
  },
  hoursContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayText: {
    fontSize: 14,
    color: "#666666",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  mapContainer: {
    alignItems: 'center',
    width: '100%',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  mapErrorContainer: {
    backgroundColor: '#FFF8E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  mapErrorText: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
  },
  mapLoadingContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  mapLoadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    lineHeight: 20,
  },
  getDirectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  getDirectionsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  socialMediaContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  servicesList: {
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  noServicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 16,
  },
  noServicesText: {
    fontSize: 16,
    color: "#999999",
    marginTop: 16,
  },
  contactForServicesButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#003366",
  },
  contactForServicesText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003366",
  },
  galleryGrid: {
    marginHorizontal: -4,
  },
  galleryItem: {
    width: "50%",
    aspectRatio: 1,
    padding: 4,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  galleryItemOverlay: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  expandGalleryButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#003366",
    marginTop: 16,
  },
  expandGalleryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003366",
  },
  noImagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  noImagesText: {
    fontSize: 16,
    color: "#999999",
    marginTop: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
  contactActionButton: {
    backgroundColor: '#F0F4FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  contactActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
  },
  contactHoursContainer: {
    marginTop: 20,
  },
  contactSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: "#CCCCCC",
  },
  bottomSheetContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  bottomSheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: BOTTOM_SHEET_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSheetHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDDDDD",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  bottomSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    marginHorizontal: 8,
  },
  bottomSheetItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bottomSheetItemContent: {
    flex: 1,
  },
  bottomSheetItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  bottomSheetItemSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  callButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
  },
  bottomSheetCancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  bottomSheetCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  imageViewerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageViewerContent: {
    width: width - 32,
    height: width - 32,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  imageViewerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageViewerControls: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  imageViewerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  // shareOptionsOverlay: {
  //   position: "absolute",
  //   top: -100,
  //   left: -100,
  //   right: -100,
  //   bottom: -100,
  // },
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  reviewModalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  reviewModalCloseButton: {
    padding: 4,
  },
  reviewModalContent: {
    padding: 16,
    maxHeight: 400,
  },
  reviewModalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    marginTop: 16,
  },
  reviewModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
  },
  reviewModalInputIcon: {
    marginRight: 8,
  },
  reviewModalInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  ratingSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  ratingStarButton: {
    padding: 8,
  },
  reviewTextInputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    padding: 12,
  },
  reviewTextInput: {
    fontSize: 16,
    color: '#333333',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
  reviewModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelReviewButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  cancelReviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  submitReviewButton: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitReviewButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitReviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})

export default BusinessDetailScreen