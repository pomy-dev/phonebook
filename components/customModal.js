import { useState, useRef, useEffect, useContext } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  StatusBar,
  Animated,
  StyleSheet
} from "react-native";
import { BlurView } from "expo-blur"
import { Icons } from '../constants/Icons';
import { AppContext } from '../context/appContext';
import { handleCall, handleWhatsapp, handleEmail, handleShareVia, handleLocation } from "../utils/callFunctions";

export function CustomModal({ isModalVisible, selectedBronzeBusiness, onClose }) {
  const [showShareOptions, setShowShareOptions] = useState(false)
  const shareOptionsAnim = useRef(new Animated.Value(0)).current
  const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0
  const { theme } = useContext(AppContext);

  const handleShare = async () => {
    setShowShareOptions(!showShareOptions)
  }

  const shareVia = async (method) => {
    await handleShareVia(method, selectedBronzeBusiness);
    setShowShareOptions(false);
  }

  useEffect(() => {
    if (showShareOptions) {
      Animated.spring(shareOptionsAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start()
    } else {
      Animated.timing(shareOptionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showShareOptions])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.upgradeModalContent, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.upgradeModalHeader, { backgroundColor: theme.colors.indicator }]}>
            <Text style={[styles.upgradeModalTitle, { color: theme.colors.secondary }]}>Business Information</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => onClose()}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Icons.Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {selectedBronzeBusiness && (
            <View style={styles.upgradeModalBody}>
              <View style={styles.businessBranding}>
                <View style={styles.businessLogoContainer}>
                  {selectedBronzeBusiness.logo ? (
                    <Image
                      source={{ uri: selectedBronzeBusiness.logo }}
                      style={styles.businessLogo}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.businessInitialContainer}>
                      <Text style={styles.businessInitial}>
                        {selectedBronzeBusiness.company_name.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.upgradeBusinessName, { width: 160, color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedBronzeBusiness.company_name}
                  </Text>
                  <Text style={[styles.businessType, { color: theme.colors.sub_text }]}>
                    {selectedBronzeBusiness.company_type}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: 5 }}
                onPress={handleShare}
              >
                <Icons.Feather name="share-2" size={24} color={theme.colors.indicator} />
              </TouchableOpacity>

              <View style={styles.basicInfoContainer}>
                {selectedBronzeBusiness.phone &&
                  selectedBronzeBusiness.phone.length > 0 && (
                    <TouchableOpacity
                      style={styles.basicInfoItem}
                      onPress={() => handleCall(selectedBronzeBusiness.phone)}
                    >
                      <Icons.Ionicons
                        name="call-outline"
                        size={20}
                        color="#003366"
                      />
                      <Text style={styles.basicInfoText}>
                        {selectedBronzeBusiness.phone[0].number}
                      </Text>
                    </TouchableOpacity>
                  )
                }

                {selectedBronzeBusiness.phone &&
                  selectedBronzeBusiness.phone.some(
                    (p) => p.phone_type === "whatsApp"
                  ) && (
                    <TouchableOpacity
                      style={styles.basicInfoItem}
                      onPress={() =>
                        handleWhatsapp(selectedBronzeBusiness.phone)
                      }
                    >
                      <Icons.Ionicons
                        name="logo-whatsapp"
                        size={20}
                        color="#25D366"
                      />
                      <Text style={styles.basicInfoText}>
                        {selectedBronzeBusiness.phone.find(
                          (p) => p.phone_type === "whatsApp"
                        )?.number || selectedBronzeBusiness.phone[0].number}
                      </Text>
                    </TouchableOpacity>
                  )
                }

                <TouchableOpacity
                  style={styles.basicInfoItem}
                  onPress={(e) => handleLocation(selectedBronzeBusiness.address, e)}
                >
                  <Icons.Ionicons
                    name="location-outline"
                    size={20}
                    color="#5856D6"
                  />
                  <Text style={styles.basicInfoText}>
                    {selectedBronzeBusiness.address}
                  </Text>
                </TouchableOpacity>

                {selectedBronzeBusiness.email && (
                  <TouchableOpacity
                    style={styles.basicInfoItem}
                    onPress={() => handleEmail(selectedBronzeBusiness.email)}
                  >
                    <Icons.Ionicons name="mail-outline" size={20} color="#FF9500" />
                    <Text style={styles.basicInfoText}>
                      {selectedBronzeBusiness.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.primaryActionButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => {
                    onClose();
                    if (
                      selectedBronzeBusiness.phone &&
                      selectedBronzeBusiness.phone.length > 0
                    ) {
                      handleCall(selectedBronzeBusiness.phone);
                    }
                  }}
                >
                  <Icons.Ionicons name="call-outline" size={18} color="#CCC" />
                  <Text style={[styles.primaryActionText, { color: "#CCC" }]}>Call Business</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* share options */}
        <Animated.View
          style={[
            styles.shareOptionsContainer,
            Platform.OS === "android" && { top: STATUSBAR_HEIGHT + 190 },
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
              <Text style={styles.shareOptionText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("email")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#FF9500" }]}>
                <Icons.Ionicons name="mail-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("copy")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#5856D6" }]}>
                <Icons.Ionicons name="copy-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareVia("more")} activeOpacity={0.7}>
              <View style={[styles.shareOptionIcon, { backgroundColor: "#8E8E93" }]}>
                <Icons.Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.shareOptionText}>More</Text>
            </TouchableOpacity>

          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  upgradeModalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: 'auto'
  },
  upgradeModalHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  upgradeModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeModalBody: {
    padding: 20,
  },
  businessBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  businessLogoContainer: {
    width: 120,
    height: 100,
    borderRadius: 15,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  businessLogo: {
    width: '90%',
    height: '90%',
    borderRadius: 10
  },
  businessInitialContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  businessInitial: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  upgradeBusinessName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  businessType: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  basicInfoContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  basicInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  basicInfoText: {
    fontSize: 15,
    color: "#333333",
    marginLeft: 12,
    flex: 1,
    flexWrap: "wrap",
  },
  actionButtonsContainer: {
    gap: 16,
  },
  primaryActionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    backgroundColor: "#F8F8F8",
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
    marginTop: 4,
  },
  shareOptionsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 90,
    right: 64,
    borderRadius: 16,
    zIndex: 100,
  },
  shareOptionsBlur: {
    flexDirection: "row",
    backgroundColor: Platform.OS === "ios" ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
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
    color: "#333333",
  },
  // modalOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   zIndex: 2000,
  // },
})

