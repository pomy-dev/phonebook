import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '../constants/Icons'
import { mockVacancies, allIndustries } from '../utils/mockData';

export default function VacanciesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredVacancies, setFilteredVacancies] = useState(mockVacancies);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCompany: '',
    currentPosition: '',
    experience: '',
    education: '',
    skills: '',
    coverLetter: '',
    portfolioUrl: '',
    expectedSalary: '',
    availableStartDate: ''
  });

  const industries = ['all', ...allIndustries.slice(0, 10)];

  const handleFilterChange = (industry) => {
    setSelectedFilter(industry);
    if (industry === 'all') {
      setFilteredVacancies(mockVacancies);
    } else {
      setFilteredVacancies(mockVacancies.filter(vacancy => vacancy.industry === industry));
    }
  };

  const handleApplyJob = (vacancy) => {
    setSelectedVacancy(vacancy);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = () => {
    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', `Your application for ${selectedVacancy?.title} has been submitted!`);
    setShowApplicationModal(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      currentCompany: '',
      currentPosition: '',
      experience: '',
      education: '',
      skills: '',
      coverLetter: '',
      portfolioUrl: '',
      expectedSalary: '',
      availableStartDate: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full-time': return '#10b981';
      case 'part-time': return '#f97316';
      case 'contract': return '#8b5cf6';
      case 'internship': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Opportunities</Text>
        <Text style={styles.subtitle}>Find your next career opportunity</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
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
          <TouchableOpacity key={vacancy.id} style={styles.vacancyCard}>
            <View style={styles.vacancyHeader}>
              <View style={[
                styles.jobTypeBadge,
                { backgroundColor: getJobTypeColor(vacancy.type) }
              ]}>
                <Text style={styles.jobTypeBadgeText}>
                  {vacancy.type.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{vacancy.industry}</Text>
              </View>
            </View>

            <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
            <View style={styles.companyRow}>
              <Icons.Ionicons name='business' size={16} color="#6b7280" />
              <Text style={styles.companyName}>{vacancy.company}</Text>
            </View>

            <Text style={styles.vacancyDescription}>{vacancy.description}</Text>

            <View style={styles.vacancyDetails}>
              <View style={styles.detailRow}>
                <Icons.Feather name='map-pin' size={16} color="#6b7280" />
                <Text style={styles.detailText}>{vacancy.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icons.FontAwesome name='dollar' size={16} color="#6b7280" />
                <Text style={styles.detailText}>{vacancy.salary}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icons.AntDesign name='clock-cirlce' size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  Deadline: {formatDate(vacancy.deadline)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icons.FontAwesome name='users' size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {vacancy.applicants} applicants
                </Text>
              </View>
            </View>

            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Key Requirements:</Text>
              {vacancy.requirements.slice(0, 3).map((req, index) => (
                <Text key={index} style={styles.requirementItem}>• {req}</Text>
              ))}
            </View>

            <View style={styles.vacancyFooter}>
              <Text style={styles.postedDate}>
                Posted {formatDate(vacancy.postedDate)}
              </Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApplyJob(vacancy)}
              >
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showApplicationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowApplicationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply for Position</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowApplicationModal(false)}
            >
              <Icons.FontAwesome name='remove' size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.jobSummary}>
              <Text style={styles.jobSummaryTitle}>{selectedVacancy?.title}</Text>
              <Text style={styles.jobSummaryCompany}>{selectedVacancy?.company}</Text>
              <Text style={styles.jobSummaryDetails}>
                {selectedVacancy?.location} • {selectedVacancy?.salary}
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <Icons.EvilIcons name='user' size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.fullName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                    placeholder="Enter your full name"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <Icons.Ionicons name='mail-outline' size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    placeholder="your.email@company.com"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Icons.Feather name='phone' size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.phone}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                    placeholder="+1 (555) 123-4567"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Professional Background</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Company</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.currentCompany}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentCompany: text }))}
                  placeholder="Your current employer"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Position</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.currentPosition}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentPosition: text }))}
                  placeholder="Your current job title"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Years of Experience</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.experience}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
                  placeholder="e.g., 5 years"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Education</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.education}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, education: text }))}
                  placeholder="Your educational background"
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Key Skills</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.skills}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, skills: text }))}
                  placeholder="List your relevant skills"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Application Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cover Letter *</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.coverLetter}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, coverLetter: text }))}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Portfolio/Linkedin</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.portfolioUrl}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, portfolioUrl: text }))}
                  placeholder="https://yourportfolio.com"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expected Salary</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.expectedSalary}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, expectedSalary: text }))}
                  placeholder="e.g., $80,000 - $100,000"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Available Start Date</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.availableStartDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, availableStartDate: text }))}
                  placeholder="e.g., Immediately, 2 weeks notice"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowApplicationModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitApplication}
            >
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  filterContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
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
    flex: 1,
    paddingHorizontal: 20,
  },
  vacancyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vacancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  industryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  industryBadgeText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  vacancyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 6,
  },
  vacancyDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  vacancyDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  vacancyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  applyButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobSummary: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  jobSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  jobSummaryCompany: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  jobSummaryDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
  },
  textInputFull: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});