import { Linking } from "react-native";

export default function connectEmail(account) {
  Linking.openURL(`mailto:${account}`)
}