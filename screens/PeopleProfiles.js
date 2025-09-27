import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Icons } from "../constants/Icons";
import { AppContext } from '../context/appContext';
import { mockProfiles, allIndustries } from '../utils/mockData';

export default function PeopleScreen() {
  const { theme, isDarkMode } = React.useContext(AppContext);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);

  const industries = ['all', ...allIndustries];

  const handleIndustryFilter = (industry) => {
    setSelectedIndustry(industry);
    applyFilters(industry, selectedAvailability);
  };

  const handleAvailabilityFilter = (availability) => {
    setSelectedAvailability(availability);
    applyFilters(selectedIndustry, availability);
  };

  const applyFilters = (industry, availability) => {
    let filtered = mockProfiles;

    if (industry !== 'all') {
      filtered = filtered.filter(profile => profile.industry === industry);
    }

    if (availability === 'available') {
      filtered = filtered.filter(profile => profile.isAvailableForWork);
    } else if (availability === 'unavailable') {
      filtered = filtered.filter(profile => !profile.isAvailableForWork);
    }

    setFilteredProfiles(filtered);
  };

  const openLinkedIn = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, textAlign: 'center' }]}>Professional Network</Text>
        <Text style={[styles.subtitle, { color: theme.colors.sub_text }]}>Connect with industry professionals</Text>
      </View>

      <View style={styles.filtersSection}>
        <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>Industry</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {industries.map((industry) => (
            <TouchableOpacity
              key={industry}
              style={[
                styles.filterChip,
                selectedIndustry === industry && styles.filterChipActive
              ]}
              onPress={() => handleIndustryFilter(industry)}
            >
              <Text style={[
                styles.filterText,
                selectedIndustry === industry && styles.filterTextActive
              ]}>
                {industry === 'all' ? 'All' : industry}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>Availability</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['all', 'available', 'unavailable'].map((availability) => (
            <TouchableOpacity
              key={availability}
              style={[
                styles.filterChip,
                selectedAvailability === availability && styles.filterChipActive
              ]}
              onPress={() => handleAvailabilityFilter(availability)}
            >
              <Text style={[
                styles.filterText,
                selectedAvailability === availability && styles.filterTextActive
              ]}>
                {availability === 'all' ? 'All' :
                  availability === 'available' ? 'Open to Work' : 'Not Available'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.profilesList} showsVerticalScrollIndicator={false}>
        {filteredProfiles.map((profile) => (
          <TouchableOpacity key={profile.id} style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />

              <View style={styles.profileInfo}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
                <Text style={[styles.experience, { color: theme.colors.sub_text }]}>
                  Maritary Status: Mrs
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.availabilityBadge,
                  { backgroundColor: profile.isAvailableForWork ? '#dcfce7' : '#fef3c7' }
                ]}>
                  <Text style={[
                    styles.availabilityText,
                    { color: profile.isAvailableForWork ? '#16a34a' : '#d97706' }
                  ]}>
                    {profile.isAvailableForWork ? 'Open to Work' : 'Employed'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'start', marginBottom: 12 }}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{profile.title}</Text>
              <View style={styles.companyRow}>
                <Icons.Feather name='briefcase' size={14} color={theme.colors.text} />
                <Text style={[styles.company, { color: theme.colors.text }]}>{profile.company}</Text>
              </View>
              <View style={styles.locationRow}>
                <Icons.Feather name='map-pin' size={14} color={theme.colors.text} />
                <Text style={[styles.location, { color: theme.colors.text }]}>{profile.location}</Text>
              </View>
            </View>

            <View style={styles.profileDetails}>
              <Text style={[styles.experience, { color: theme.colors.text }]}>
                {profile.experience} of experience in {profile.industry}
              </Text>
              <Text style={[styles.education, { color: theme.colors.text }]}>{profile.education}</Text>
            </View>

            <View style={styles.skillsSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {profile.skills.slice(0, 6).map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={[styles.skillText, { color: theme.colors.text }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.achievementsSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Key Achievements</Text>
              {profile.achievements.slice(0, 2).map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Icons.FontAwesome6 name='award' size={14} color="#f97316" />
                  <Text style={[styles.achievementText, { color: theme.colors.sub_text }]}>{achievement}</Text>
                </View>
              ))}
            </View>

            <View style={styles.profileFooter}>
              <TouchableOpacity
                style={styles.linkedinButton}
                onPress={() => openLinkedIn(profile.linkedinUrl)}
              >
                <Icons.Feather name='external-link' size={16} color={"#0077b5"} />
                <Text style={styles.linkedinText}>LinkedIn</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.connectButton, { backgroundColor: theme.colors.indicator }]}>
                <Text style={styles.connectButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  filtersSection: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterContainer: {
    paddingLeft: 20,
  },
  filterChip: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filterText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  profilesList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 16
  },
  profileCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  profileDetails: {
    marginBottom: 16,
  },
  experience: {
    fontSize: 14,
    marginBottom: 4,
  },
  education: {
    fontSize: 13,
  },
  skillsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  achievementsSection: {
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  achievementText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkedinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkedinText: {
    fontSize: 12,
    color: '#0077b5',
    fontWeight: '600',
    marginLeft: 4,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '600',
  },
});