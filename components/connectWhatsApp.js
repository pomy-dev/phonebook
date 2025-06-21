import { Linking } from "react-native";

export default function connectWhatsApp(number) {
  Linking.openURL(`whatsapp://send?phone=${number}`);
}