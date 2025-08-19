import React, { useState } from "react";
import Clipboard from '@react-native-clipboard/clipboard';
import { Linking, Platform, Share, Alert } from "react-native";
import { CustomToast } from "./customToast";

export async function handleShareVia(method, business) {
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
        CustomToast('Copied', 'Business details copied to clipboard!')
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
  }
};

export async function handleCall(phoneNumbers, e) {
  if (e) {
    e.stopPropagation();
  }

  if (!phoneNumbers || phoneNumbers.length === 0) {
    Alert.alert(
      "No Phone Number",
      "This business has no phone number listed."
    );
    return;
  }

  if (phoneNumbers.length === 1) {
    Linking.openURL(`tel:${phoneNumbers[0].number}`)
  } else if (phoneNumbers.length > 1) {
    // If there are multiple phone numbers, show a selection dialog with cancel option
    const options = phoneNumbers.map((phone) => ({
      text: `${phone.phone_type.charAt(0).toUpperCase() + phone.phone_type.slice(1)
        }: ${phone.number}`,
      onPress: () => Linking.openURL(`tel:${phone.number}`)
    }));

    // Add cancel option
    // options.push({ text: "Cancel", style: "cancel" });
    // Alert.alert("Select Phone Number", "Choose a number to call", options);
    return options
  }
}

export async function handleWhatsapp(phones, e) {
  if (e) {
    e.stopPropagation();
  }

  if (!phones || phones.length === 0) {
    Alert.alert(
      "No WhatsApp",
      "This business has no WhatsApp number listed."
    );
    return;
  }

  for (let i = 0; i < phones.length; i++) {
    if (phones[i].phone_type == "whatsapp") {
      Linking.openURL(`whatsapp://send?phone=${number}`);
      return;
    } else {
      Alert.alert(
        "No WhatsApp",
        "This business has no WhatsApp number listed."
      );
    }
  }
};

export async function handleEmail(email, e) {
  if (e) {
    e.stopPropagation();
  }
  Linking.openURL(`mailto:${email}`)
};

export async function handleLocation(address, e) {
  if (e) {
    e.stopPropagation();
  }
  const url = Platform.select({
    ios: `maps:0,0?q=${address}`,
    android: `geo:0,0?q=${address}`,
  })
  Linking.openURL(url)
}

export async function handleWebsite(business) {
  if (business.website) {
    Linking.openURL(business.website)
  } else {
    Alert.alert(`Website not Found','Company\'s own website could not be found\nTry this link though: https://industrylines.netlify.app/views/business-detail.html?id=${business._id}`)
  }
}

export async function handleBusinessPress(business, navigation, setSelectedBronzeBusiness, setUpgradeModalVisible) {
  if (
    business.subscription_type &&
    business.subscription_type.toLowerCase() === "bronze"
  ) {
    // For Bronze businesses, show upgrade modal instead of navigating
    setSelectedBronzeBusiness(business);
    setUpgradeModalVisible(true);
  } else {
    // For Silver and Gold, navigate to business detail
    navigation.navigate("BusinessDetail", { business });
  }
};