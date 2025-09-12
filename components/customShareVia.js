import {
  StyleSheet, Text, View, Animated,
  Platform, TouchableOpacity
} from 'react-native';
import { BlurView } from "expo-blur";
import { Icons } from "../constants/Icons";

export default function CustomShareVia({ STATUSBAR_HEIGHT, shareOptionsAnim, showShareOptions, theme, shareVia }) {

  return (
    <Animated.View
      style={[
        styles.shareOptionsContainer,
        Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 110 },
        {
          opacity: shareOptionsAnim,
          transform: [
            {
              translateY: shareOptionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents={showShareOptions ? "auto" : "none"}
    >
      <BlurView intensity={80} style={styles.shareOptionsBlur}>
        <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("message")} activeOpacity={0.7}>
          <View style={[styles.shareOptionIcon, { backgroundColor: "#4CD964" }]}>
            <Icons.Ionicons name="chatbox-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.shareOptionText, { color: theme.colors.text }]}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("email")} activeOpacity={0.7}>
          <View style={[styles.shareOptionIcon, { backgroundColor: "#FF9500" }]}>
            <Icons.Ionicons name="mail-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.shareOptionText, { color: theme.colors.text }]}>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("copy")} activeOpacity={0.7}>
          <View style={[styles.shareOptionIcon, { backgroundColor: "#5856D6" }]}>
            <Icons.Ionicons name="copy-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.shareOptionText, { color: theme.colors.text }]}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("more")} activeOpacity={0.7}>
          <View style={[styles.shareOptionIcon, { backgroundColor: "#8E8E93" }]}>
            <Icons.Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.shareOptionText, { color: theme.colors.text }]}>More</Text>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  shareOptionsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 90,
    right: 16,
    borderRadius: 16,
    zIndex: 100,
  },
  shareOptionsBlur: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: Platform.OS === "ios" ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.95)",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareOption: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  shareOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shareOptionText: {
    fontSize: 12,
  },
})