import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '../constants/Icons';
import { Images } from '../constants/Images';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/appContext';
import { mockVacancies, allIndustries } from '../utils/mockData';

export default function VacanciesScreen({ navigation }) {
  const { theme, isDarkMode } = React.useContext(AppContext);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredVacancies, setFilteredVacancies] = useState(mockVacancies);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const industries = ['all', ...allIndustries];

  const handleFilterChange = (industry) => {
    setSelectedFilter(industry);
    if (industry === 'all') {
      setFilteredVacancies(mockVacancies);
    } else {
      setFilteredVacancies(mockVacancies.filter(vacancy => vacancy.industry === industry));
    }
  };

  const handleApplyJob = (vacancy) => {
    if (vacancy.recruitmentEmail) {
      Linking.openURL(`mailto:${vacancy.recruitmentEmail}?subject=Application for ${vacancy.title}`);
    } else {
      Alert.alert('Error', 'No recruitment email available for this vacancy');
    }
  };

  const handleViewImage = (vacancy) => {
    vacancy.imageUrl && (
      setSelectedImage(vacancy.imageUrl), // Use vacancy image or placeholder
      setShowImageModal(true)
    );

  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => {
            navigation.goBack();
          }}>
            <Icons.Ionicons name='arrow-back' size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Vacancies</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.colors.sub_text }]}>Find your next career opportunity</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        {industries.map((industry) => (
          <TouchableOpacity
            key={industry}
            style={[
              styles.filterChip,
              selectedFilter === industry && styles.filterChipActive
            ]}
            onPress={() => handleFilterChange(industry)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === industry && styles.filterTextActive
            ]}>
              {industry === 'all' ? 'All Industries' : industry}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.vacanciesList} showsVerticalScrollIndicator={false}>
        {filteredVacancies.map((vacancy) => (
          <TouchableOpacity
            key={vacancy.id}
            style={[styles.vacancySummary, { backgroundColor: theme.colors.card }]}
            activeOpacity={0.9}
            onPress={() => handleViewImage(vacancy)} // Trigger image modal
          >
            <View style={styles.imageContainer}>
              {vacancy.imageUrl ? (
                <>
                  <Image
                    source={vacancy.imageUrl}
                    style={styles.vacancyImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
                    style={styles.imageOverlay}
                  />
                </>
              ) : (
                <Image
                  source={Images.noImage}
                  style={styles.vacancyImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{vacancy.industry}</Text>
              </View>
            </View>

            <View style={styles.vacancyFooter}>
              <Text style={[styles.postedDate, { color: theme.colors.sub_text }]}>
                Posted {formatDate(vacancy.postedDate)}
              </Text>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: theme.colors.indicator }]}
                onPress={() => handleApplyJob(vacancy)}
              >
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New Image Modal */}
      <Modal
        visible={showImageModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <Image
            source={selectedImage}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setShowImageModal(false)}
          >
            <Icons.FontAwesome name='remove' size={24} color="#ffffff" />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: '25%',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  filterChip: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 32,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  vacanciesList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  vacancySummary: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    minHeight: 300,
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  vacancyImage: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  industryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  industryBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  vacancyFooter: {
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 40, // Adjusted for SafeAreaView
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
});