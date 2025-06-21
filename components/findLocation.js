import { Linking, Platform } from "react-native";

export default function handleGetDirections(address) {
  const url = Platform.select({
    ios: `maps:0,0?q=${address}`,
    android: `geo:0,0?q=${address}`,
  })
  Linking.openURL(url)
}