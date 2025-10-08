import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Card,
  Text,
  TextInput
} from 'react-native-paper';
import { theme } from '../../constants/vendorTheme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, always navigate to main app
      navigation.navigate('VendorHome');
    }, 1500);
  };

  const handleVendorLogin = () => {
    navigation.navigate('VendorRegistration');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🇸🇿</Text>
          <Text style={styles.title}>Swaziland Vendor Marketplace</Text>
          <Text style={styles.subtitle}>
            Connecting vendors, customers, and communities
          </Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>
            Sign in to discover local vendors and place orders
          </Text>

          <TextInput
            label="Email or Phone"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.registerButton}
          >
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.vendorCard}>
        <Card.Content>
          <Text style={styles.vendorTitle}>Are you a vendor?</Text>
          <Text style={styles.vendorSubtitle}>
            Join our marketplace to reach more customers and connect with bulk buying groups
          </Text>

          <Button
            mode="outlined"
            onPress={handleVendorLogin}
            style={styles.vendorButton}
            contentStyle={styles.buttonContent}
          >
            Vendor Registration
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Why Choose Our Platform?</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔍</Text>
          <Text style={styles.featureText}>Discover local vendors near you</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>👥</Text>
          <Text style={styles.featureText}>Join bulk buying groups for better prices</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🚚</Text>
          <Text style={styles.featureText}>Fast delivery to your location</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📱</Text>
          <Text style={styles.featureText}>Real-time stock updates</Text>
        </View>
      </View>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    margin: 20,
    elevation: 4,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.placeholder,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  vendorCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
    borderColor: theme.colors.accent,
    borderWidth: 1,
  },
  vendorTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.accent,
  },
  vendorSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.placeholder,
  },
  vendorButton: {
    borderColor: theme.colors.accent,
  },
  features: {
    margin: 20,
    marginTop: 0,
  },
  featuresTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.primary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
});
