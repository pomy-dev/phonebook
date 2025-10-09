import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icons } from '../../constants/Icons';
import {
  Button,
  Card,
  Text
} from 'react-native-paper';
import { theme } from '../../constants/vendorTheme';

export default function LoginScreen({ navigation }) {

  const handleVendorLogin = () => {
    navigation.navigate('AddVendor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons.Ionicons name='arrow-back' style={{ color: theme.colors.primary, fontSize: 24 }} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.colors.primary }]}>Local Market</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

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

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('VendorHome')}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Continue as Guest
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', marginTop: 50
  },
  backButton: {
    position: 'absolute', left: 0, padding: 10
  },
  headerText: {
    position: 'absolute', left: '30%', textAlign: 'center', fontSize: 24, fontWeight: 'bold',
  },
  vendorCard: {
    // paddingTop: 60,
    marginTop: 60,
    marginHorizontal: 20,
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
  card: {
    margin: 20,
    elevation: 4,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
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
