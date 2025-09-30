import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Icons } from '../constants/Icons';
import { AppContext } from '../context/appContext';

// interface ProfileData {
//   name: string;
//   title: string;
//   company: string;
//   location: string;
//   industry: string;
//   experience: string;
//   skills: string[];
//   achievements: string[];
//   education: string;
//   linkedinUrl: string;
//   avatar: string;
//   isAvailableForWork: boolean;
// }

export default function ProfileScreen({ navigation, route }) {
  const { theme, isDarkMode } = React.useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    title: 'Software Developer',
    company: 'Tech Solutions Inc.',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: '5 years',
    skills: ['JavaScript', 'React', 'Node.js'],
    achievements: ['Led development of flagship product'],
    education: 'BS Computer Science, UC Berkeley',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: true,
  });
  const minimal = route?.params?.minimal;

  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education', 'Marketing',
    'Energy', 'Agriculture', 'Construction', 'Transportation', 'Retail', 'Hospitality',
    'Real Estate', 'Legal', 'Consulting', 'Media', 'Telecommunications', 'Automotive',
    'Aerospace', 'Biotechnology', 'Pharmaceuticals', 'Food & Beverage', 'Fashion',
    'Sports', 'Non-profit', 'Government', 'Insurance', 'Banking', 'Entertainment',
    'Gaming', 'Other'
  ];

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievementToRemove) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        {/* back button */}
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icons.Ionicons name='arrow-back' size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.text }]}>My Profile</Text>

        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.saveButton]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Icons.Ionicons name='save-outline' size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Save</Text>
            </>
          ) : (
            <Text style={[styles.editButtonText, { color: theme.colors.text }]}>Edit Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <>
          <View style={styles.avatarSection}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
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

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Icons.Ionicons name='person-circle-outline' size={24} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Basic Information</Text>
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={profile.name}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Professional Title</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={profile.title}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, title: text }))}
                  placeholder="Your job title"
                />
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.title}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Company</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={profile.company}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, company: text }))}
                  placeholder="Current company"
                />
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.company}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Location</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={profile.location}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, location: text }))}
                  placeholder="City, State"
                />
              ) : (
                <View style={styles.fieldValueRow}>
                  <Icons.Feather name='map-pin' size={16} color={theme.colors.light} />
                  <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.location}</Text>
                </View>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Industry</Text>
              {isEditing ? (
                <View style={styles.industrySelector}>
                  {industries.map((industry) => (
                    <TouchableOpacity
                      key={industry}
                      style={[
                        styles.industryChip,
                        profile.industry === industry && styles.industryChipSelected
                      ]}
                      onPress={() => setProfile(prev => ({ ...prev, industry }))}
                    >
                      <Text style={[
                        styles.industryChipText,
                        profile.industry === industry && styles.industryChipTextSelected, { color: theme.colors.text }
                      ]}>
                        {industry}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.industry}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Experience</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={profile.experience}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, experience: text }))}
                  placeholder="e.g., 5 years"
                />
              ) : (
                <View style={styles.fieldValueRow}>
                  <Icons.Feather name='briefcase' size={16} color={theme.colors.light} />
                  <Text style={[styles.fieldValue, { color: theme.colors.sub_text }]}>{profile.experience}</Text>
                </View>
              )}
            </View>

            {isEditing && (
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Work Availability</Text>
                <View style={styles.availabilitySelector}>
                  <TouchableOpacity
                    style={[
                      styles.availabilityOption,
                      profile.isAvailableForWork && styles.availabilityOptionSelected
                    ]}
                    onPress={() => setProfile(prev => ({ ...prev, isAvailableForWork: true }))}
                  >
                    <Text style={[
                      styles.availabilityOptionText,
                      profile.isAvailableForWork && styles.availabilityOptionTextSelected
                    ]}>
                      Open to Work
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.availabilityOption,
                      !profile.isAvailableForWork && styles.availabilityOptionSelected
                    ]}
                    onPress={() => setProfile(prev => ({ ...prev, isAvailableForWork: false }))}
                  >
                    <Text style={[
                      styles.availabilityOptionText,
                      !profile.isAvailableForWork && styles.availabilityOptionTextSelected, { color: theme.colors.text }
                    ]}>
                      Employed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Icons.FontAwesome6 name='graduation-cap' size={20} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Education</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={profile.education}
                onChangeText={(text) => setProfile(prev => ({ ...prev, education: text }))}
                placeholder="Degree, University"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.education}</Text>
            )}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Icons.Entypo name='star' size={24} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills</Text>
            </View>
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeSkill(skill)}
                    >
                      <Icons.FontAwesome name='remove' size={12} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            {isEditing && (
              <View style={styles.addSkillContainer}>
                <TextInput
                  style={styles.addSkillInput}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add a skill"
                />
                <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                  <Icons.Entypo name='plus' size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Icons.FontAwesome6 name='award' size={20} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
            </View>
            {profile.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementText}>• {achievement}</Text>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeAchievement(achievement)}
                  >
                    <Icons.FontAwesome name='remove' size={14} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditing && (
              <View style={styles.addAchievementContainer}>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={newAchievement}
                  onChangeText={setNewAchievement}
                  placeholder="Add an achievement"
                  multiline
                />
                <TouchableOpacity style={styles.addButton} onPress={addAchievement}>
                  <Icons.Entypo name='plus' size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card, marginBottom: 30 }]}>
            <View style={styles.sectionHeader}>
              <Icons.EvilIcons name='external-link' size={24} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>LinkedIn Profile</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                value={profile.linkedinUrl}
                onChangeText={(text) => setProfile(prev => ({ ...prev, linkedinUrl: text }))}
                placeholder="LinkedIn profile URL"
              />
            ) : (
              <TouchableOpacity style={styles.linkedinLink}>
                <Icons.EvilIcons name='external-link' size={16} color="#0077b5" />
                <Text style={styles.linkedinText}>View LinkedIn Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: 15,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  editButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  cardBody: {
    marginHorizontal: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dcdcdcff',
    marginBottom: 20,
    borderRadius: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  industrySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  industryChip: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  industryChipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  industryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  industryChipTextSelected: {
    color: '#030303ff',
  },
  availabilitySelector: {
    flexDirection: 'row',
    marginTop: 8,
  },
  availabilityOption: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  availabilityOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  availabilityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityOptionTextSelected: {
    color: '#ffffff',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 6,
    padding: 2,
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSkillInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  addAchievementContainer: {
    marginTop: 12,
  },
  linkedinLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  linkedinText: {
    fontSize: 14,
    color: '#0077b5',
    fontWeight: '600',
    marginLeft: 6,
  },
});