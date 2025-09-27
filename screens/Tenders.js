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
import { FileText, DollarSign, Calendar, MapPin, AlertCircle, Clock, X, User, Mail, Phone, Building, Users } from 'lucide-react-native';
import { mockTenders, allIndustries } from '../utils/mockData';
import { Tender } from '../utils/types';

export default function TendersScreen() {
  const [selectedFilter, setSelectedFilter] = useState < string > ('all');
  const [filteredTenders, setFilteredTenders] = useState < Tender > (mockTenders);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState < Tender | null > (null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessRegistration: '',
    experience: '',
    teamSize: '',
    proposedBudget: '',
    timeline: '',
    approach: '',
    previousWork: '',
    certifications: '',
    additionalInfo: ''
  });

  const industries = ['all', ...allIndustries.slice(0, 8)];

  const handleFilterChange = (industry) => {
    setSelectedFilter(industry);
    if (industry === 'all') {
      setFilteredTenders(mockTenders);
    } else {
      setFilteredTenders(mockTenders.filter(tender => tender.industry === industry));
    }
  };

  const handleSubmitBid = (tender) => {
    if (tender.status === 'closed') return;
    setSelectedTender(tender);
    setShowBidModal(true);
  };

  const handleBidSubmission = () => {
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.proposedBudget || !formData.approach) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', `Your bid for ${selectedTender?.title} has been submitted!`);
    setShowBidModal(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      businessRegistration: '',
      experience: '',
      teamSize: '',
      proposedBudget: '',
      timeline: '',
      approach: '',
      previousWork: '',
      certifications: '',
      additionalInfo: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#10b981';
      case 'closing-soon': return '#f97316';
      case 'closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FileText size={16} color="#10b981" />;
      case 'closing-soon': return <AlertCircle size={16} color="#f97316" />;
      case 'closed': return <Clock size={16} color="#ef4444" />;
      default: return <FileText size={16} color="#6b7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Tenders</Text>
        <Text style={styles.subtitle}>Find contract opportunities for your business</Text>
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

      <ScrollView style={styles.tendersList} showsVerticalScrollIndicator={false}>
        {filteredTenders.map((tender) => (
          <TouchableOpacity key={tender.id} style={styles.tenderCard}>
            <View style={styles.tenderHeader}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(tender.status) }
              ]}>
                <View style={styles.statusBadgeContent}>
                  {getStatusIcon(tender.status)}
                  <Text style={styles.statusBadgeText}>
                    {tender.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.industryBadge}>
                <Text style={styles.industryBadgeText}>{tender.industry}</Text>
              </View>
            </View>

            <Text style={styles.tenderTitle}>{tender.title}</Text>
            <Text style={styles.companyName}>{tender.company}</Text>

            <Text style={styles.tenderDescription}>{tender.description}</Text>

            <View style={styles.tenderDetails}>
              <View style={styles.detailRow}>
                <DollarSign size={16} color="#6b7280" />
                <Text style={styles.detailText}>Budget: {tender.budget}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  Deadline: {formatDate(tender.deadline)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.detailText}>{tender.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {tender.bidders} bidders
                </Text>
              </View>
            </View>

            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Key Requirements:</Text>
              {tender.requirements.slice(0, 3).map((req, index) => (
                <Text key={index} style={styles.requirementItem}>• {req}</Text>
              ))}
            </View>

            <View style={styles.tenderFooter}>
              <Text style={styles.postedDate}>
                Posted {formatDate(tender.postedDate)}
              </Text>
              <TouchableOpacity
                style={[
                  styles.bidButton,
                  tender.status === 'closed' && styles.bidButtonDisabled
                ]}
                disabled={tender.status === 'closed'}
                onPress={() => handleSubmitBid(tender)}
              >
                <Text style={[
                  styles.bidButtonText,
                  tender.status === 'closed' && styles.bidButtonTextDisabled
                ]}>
                  {tender.status === 'closed' ? 'Closed' : 'Submit Bid'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showBidModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBidModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit Bid</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBidModal(false)}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.tenderSummary}>
              <Text style={styles.tenderSummaryTitle}>{selectedTender?.title}</Text>
              <Text style={styles.tenderSummaryCompany}>{selectedTender?.company}</Text>
              <Text style={styles.tenderSummaryDetails}>
                Budget: {selectedTender?.budget} • Deadline: {selectedTender && formatDate(selectedTender.deadline)}
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Company Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company Name *</Text>
                <View style={styles.inputContainer}>
                  <Building size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.companyName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
                    placeholder="Your company name"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Person *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.contactPerson}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, contactPerson: text }))}
                    placeholder="Primary contact name"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    placeholder="contact@company.com"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    value={formData.phone}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                    placeholder="+1 (555) 123-4567"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Registration Number</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.businessRegistration}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, businessRegistration: text }))}
                  placeholder="Business registration or license number"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Company Capabilities</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Years of Experience</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.experience}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
                  placeholder="e.g., 10 years in software development"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Team Size</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.teamSize}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, teamSize: text }))}
                  placeholder="Number of team members for this project"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relevant Certifications</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.certifications}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, certifications: text }))}
                  placeholder="List relevant certifications, licenses, or accreditations"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Bid Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Proposed Budget *</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.proposedBudget}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, proposedBudget: text }))}
                  placeholder="e.g., $450,000"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Proposed Timeline</Text>
                <TextInput
                  style={styles.textInputFull}
                  value={formData.timeline}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, timeline: text }))}
                  placeholder="e.g., 6 months from project start"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Technical Approach *</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.approach}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, approach: text }))}
                  placeholder="Describe your technical approach and methodology for this project..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Previous Similar Work</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.previousWork}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, previousWork: text }))}
                  placeholder="Describe similar projects you've completed..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Additional Information</Text>
                <TextInput
                  style={[styles.textInputFull, styles.textArea]}
                  value={formData.additionalInfo}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, additionalInfo: text }))}
                  placeholder="Any additional information that supports your bid..."
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBidModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleBidSubmission}
            >
              <Text style={styles.submitButtonText}>Submit Bid</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  tendersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tenderCard: {
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
  tenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
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
  tenderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 12,
  },
  tenderDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tenderDetails: {
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
  tenderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  bidButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bidButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  bidButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bidButtonTextDisabled: {
    color: '#9ca3af',
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
  tenderSummary: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  tenderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  tenderSummaryCompany: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  tenderSummaryDetails: {
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
    backgroundColor: '#f97316',
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