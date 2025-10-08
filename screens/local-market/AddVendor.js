import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  Chip,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import { mockAreas, mockCategories } from '../../utils/mockData';
import { theme } from '../../constants/vendorTheme';

export default function VendorRegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: 'street_vendor',
    category: '',
    area: '',
    address: '',
    description: '',
    workingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    deliveryRadius: 5,
    acceptsBulkOrders: false,
    hasLicense: false,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: value
      }
    }));
  };

  const validateStep1 = () => {
    const { businessName, ownerName, email, phone, businessType, category, area } = formData;
    if (!businessName || !ownerName || !email || !phone || !businessType || !category || !area) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your vendor registration has been submitted. You will receive a confirmation within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }, 2000);
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Business Information</Text>
      <Text style={styles.stepSubtitle}>
        Tell us about your business
      </Text>

      <TextInput
        label="Business Name *"
        value={formData.businessName}
        onChangeText={(value) => handleInputChange('businessName', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Owner/Manager Name *"
        value={formData.ownerName}
        onChangeText={(value) => handleInputChange('ownerName', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email Address *"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Phone Number *"
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Business Type *</Text>
      <RadioButton.Group
        onValueChange={(value) => handleInputChange('businessType', value)}
        value={formData.businessType}
      >
        <View style={styles.radioOption}>
          <RadioButton value="street_vendor" />
          <Text style={styles.radioLabel}>Street Vendor</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="small_shop" />
          <Text style={styles.radioLabel}>Small Shop</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton value="mobile_vendor" />
          <Text style={styles.radioLabel}>Mobile Vendor</Text>
        </View>
      </RadioButton.Group>

      <Text style={styles.sectionTitle}>Category *</Text>
      <View style={styles.chipContainer}>
        {mockCategories?.map((category) => (
          <Chip
            key={category.id}
            selected={formData.category === category.name}
            onPress={() => handleInputChange('category', category.name)}
            style={[
              styles.chip,
              formData.category === category.name && styles.selectedChip
            ]}
            textStyle={styles.chipText}
          >
            {category.icon} {category.name}
          </Chip>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Service Area *</Text>
      <View style={styles.chipContainer}>
        {mockAreas?.map((area) => (
          <Chip
            key={area}
            selected={formData.area === area}
            onPress={() => handleInputChange('area', area)}
            style={[
              styles.chip,
              formData.area === area && styles.selectedChip
            ]}
            textStyle={styles.chipText}
          >
            {area}
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Business Details</Text>
      <Text style={styles.stepSubtitle}>
        Additional information about your business
      </Text>

      <TextInput
        label="Business Address"
        value={formData.address}
        onChangeText={(value) => handleInputChange('address', value)}
        mode="outlined"
        multiline
        style={styles.input}
      />

      <TextInput
        label="Business Description"
        value={formData.description}
        onChangeText={(value) => handleInputChange('description', value)}
        mode="outlined"
        multiline
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Working Hours</Text>
      {Object.keys(formData.workingHours)?.map((day) => (
        <View key={day} style={styles.workingHoursRow}>
          <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
          <TextInput
            label="Hours (e.g., 08:00-17:00)"
            value={formData.workingHours[day]}
            onChangeText={(value) => handleWorkingHoursChange(day, value)}
            mode="outlined"
            style={styles.hoursInput}
            placeholder="Closed or 08:00-17:00"
          />
        </View>
      ))}

      <TextInput
        label="Delivery Radius (km)"
        value={formData.deliveryRadius.toString()}
        onChangeText={(value) => handleInputChange('deliveryRadius', parseInt(value) || 0)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={formData.acceptsBulkOrders ? 'checked' : 'unchecked'}
          onPress={() => handleInputChange('acceptsBulkOrders', !formData.acceptsBulkOrders)}
        />
        <Text style={styles.checkboxLabel}>
          I can accept bulk orders and participate in group buying
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={formData.hasLicense ? 'checked' : 'unchecked'}
          onPress={() => handleInputChange('hasLicense', !formData.hasLicense)}
        />
        <Text style={styles.checkboxLabel}>
          I have a valid business license (recommended)
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendor Registration</Text>
        <Text style={styles.stepIndicator}>Step {step} of 2</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {step === 1 ? renderStep1() : renderStep2()}

          <View style={styles.buttonContainer}>
            {step === 2 && (
              <Button
                mode="outlined"
                onPress={() => setStep(1)}
                style={styles.backButton}
              >
                Back
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleNext}
              loading={loading}
              style={styles.nextButton}
              contentStyle={styles.buttonContent}
            >
              {step === 1 ? 'Next' : 'Submit Registration'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.benefitsCard}>
        <Card.Content>
          <Text style={styles.benefitsTitle}>Benefits of Joining</Text>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <Text style={styles.benefitText}>Increase your customer reach</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💰</Text>
            <Text style={styles.benefitText}>Join bulk buying groups for better prices</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🚚</Text>
            <Text style={styles.benefitText}>Manage deliveries efficiently</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📱</Text>
            <Text style={styles.benefitText}>Update stock in real-time</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepIndicator: {
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
  },
  card: {
    margin: 20,
    elevation: 4,
  },
  stepTitle: {
    color: theme.colors.primary,
    marginBottom: 8,
  },
  stepSubtitle: {
    color: theme.colors.placeholder,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
  },
  hoursInput: {
    flex: 1,
    marginLeft: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  nextButton: {
    flex: 1,
    marginLeft: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  benefitsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  benefitsTitle: {
    color: theme.colors.primary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
});