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
import { Images } from '../constants/Images';
import { AppContext } from '../context/appContext';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

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
  const register = route?.params?.register;
  const { theme, isDarkMode } = React.useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState('');
  const [profile, setProfile] = register
    ? useState({
      name: '',
      title: '',
      company: '',
      location: '',
      industry: '',
      experience: '',
      skills: [],
      achievements: [],
      education: '',
      linkedinUrl: '',
      avatar: Images.default_user,
      isAvailableForWork: true,
    })
    : useState({
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

  // Function to request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Insufficient permissions!',
          'You need to grant camera and media library permissions to use this feature.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Function to open the gallery and pick an image
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
        allowsEditing: false,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        result.assets.forEach(asset => {
          handleImageSelected(asset);
        });
        const uris = result.assets.map((asset) => ({ uri: asset.uri }));
        console.log('Picked URIs:', uris);
        return uris;
      }
      return [];
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to select image. Please try again.');
    }
  };

  const handleImageSelected = async (asset) => {
    try {
      // Get file info (size, extension, etc.)
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      // Create a more suitable object for our state and later upload
      const newImage = {
        id: generateId(),
        uri: asset.uri,
        name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
        type: `image/${asset.uri.split('.').pop() || 'jpeg'}`,
        size: fileInfo.size,
        localPath: asset.uri
      };

      setImage(newImage);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    }
  };

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

        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title, { color: theme.colors.text }]}>{register ? 'Add My Profile' : 'My Profile'}</Text>

        <TouchableOpacity
          style={[styles.editButton, (isEditing || register) && styles.saveButton]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing || register ? (
            <>
              <Icons.Ionicons name='save-outline' size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Save</Text>
            </>
          ) : (
            <Text style={[styles.editButtonText, { color: '#6b7280' }]}>Edit Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <>
          <View style={styles.avatarSection}>
            <Image source={register ? image !== '' ? { uri: image.uri } : profile.avatar : { uri: profile.avatar }} style={styles.avatar} />
            {register
              ?
              <TouchableOpacity
                onPress={() => pickImage}
                style={[styles.photo, { backgroundColor: theme.colors.notification }]}>
                <Icons.EvilIcons name='image' size={24} color='#ffff' />
                <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: 400 }}>{image === '' ? 'Pick Photo' : 'Change Photo'}</Text>
              </TouchableOpacity>
              :
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
              </View>}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Icons.Ionicons name='person-circle-outline' size={24} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Basic Information</Text>
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Full Name</Text>
              {isEditing || register ? (
                <TextInput
                  style={styles.textInput}
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
              {isEditing || register ? (
                <TextInput
                  style={styles.textInput}
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
              {isEditing || register ? (
                <TextInput
                  style={styles.textInput}
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
              {isEditing || register ? (
                <TextInput
                  style={styles.textInput}
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
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Industry</Text>
              {isEditing || register ? (
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
                        profile.industry === industry && styles.industryChipTextSelected
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
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Experience</Text>
              {isEditing || register ? (
                <TextInput
                  style={styles.textInput}
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

            {isEditing || register && (
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
                      !profile.isAvailableForWork && styles.availabilityOptionTextSelected
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
            {isEditing || register ? (
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={profile.education}
                onChangeText={(text) => setProfile(prev => ({ ...prev, education: text }))}
                placeholder="Degree, University"
                multiline
              />
            ) : (
              <Text style={[styles.fieldValue, { color: theme.colors.text }]}>{profile.education}</Text>
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
                  {isEditing || register && (
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
            {isEditing || register && (
              <View style={styles.addSkillContainer}>
                <TextInput
                  style={styles.addSkillInput}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add a skill"
                />
                <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.indicator }]} onPress={addSkill}>
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
                <Text style={[styles.achievementText, { color: theme.colors.text }]}>• {achievement}</Text>
                {isEditing || register && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeAchievement(achievement)}
                  >
                    <Icons.FontAwesome name='remove' size={14} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditing || register && (
              <View style={styles.addAchievementContainer}>
                <TextInput
                  style={[styles.textInput, styles.multilineInput, { marginBottom: 5 }]}
                  value={newAchievement}
                  onChangeText={setNewAchievement}
                  placeholder="Add an achievement"
                  multiline
                />
                <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.indicator }]} onPress={addAchievement}>
                  <Text style={{ textAlign: 'center', fontSize: 16, color: '#ffff' }}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.cardBody, { backgroundColor: theme.colors.card, marginBottom: 30 }]}>
            <View style={styles.sectionHeader}>
              <Icons.EvilIcons name='external-link' size={24} color={theme.colors.indicator} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>LinkedIn Profile</Text>
            </View>
            {isEditing || register ? (
              <TextInput
                style={styles.textInput}
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
  photo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  editButton: {
    backgroundColor: '#F8FAFC',
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
    color: '#6b7280',
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
    color: '#6b7280',
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
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  availabilityOptionText: {
    color: '#6b7280',
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