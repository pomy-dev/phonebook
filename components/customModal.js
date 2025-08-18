import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet
} from "react-native";
import { Icons } from '../utils/Icons';
import findLocation from "../components/findLocation";
import { handleCall, handleWhatsapp, handleEmail } from "../utils/callFunctions";

export function CustomModal({ isModalVisible, selectedBronzeBusiness, onClose }) {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.upgradeModalContent}>
          <View style={styles.upgradeModalHeader}>
            <Text style={styles.upgradeModalTitle}>Business Information</Text>
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
                <Text style={styles.upgradeBusinessName}>
                  {selectedBronzeBusiness.company_name}
                </Text>
                <Text style={styles.businessType}>
                  {selectedBronzeBusiness.company_type}
                </Text>
              </View>

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
                  onPress={() => findLocation(selectedBronzeBusiness.address)}
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
                  style={styles.primaryActionButton}
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
                  <Icons.Ionicons name="call-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionText}>Call Business</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActionsRow}>
                  <TouchableOpacity
                    style={styles.secondaryActionButton}
                    onPress={() => {
                      handleWhatsapp(selectedBronzeBusiness.phone);
                    }}
                  >
                    <Icons.Ionicons
                      name="logo-whatsapp"
                      size={20}
                      color="#25D366"
                    />
                    <Text style={styles.secondaryActionText}>Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionButton}
                    onPress={() => {
                      handleEmail(selectedBronzeBusiness.email);
                    }}
                  >
                    <Icons.Ionicons name="mail-outline" size={20} color="#FF9500" />
                    <Text style={styles.secondaryActionText}>Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionButton}
                    onPress={() => {
                      findLocation(selectedBronzeBusiness.address);
                    }}
                  >
                    <Icons.Ionicons
                      name="location-outline"
                      size={20}
                      color="#5856D6"
                    />
                    <Text style={styles.secondaryActionText}>Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "80%",
  },
  upgradeModalHeader: {
    backgroundColor: "#003366",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  upgradeModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    alignItems: "center",
    marginBottom: 20,
  },
  businessLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    width: 50,
    height: 50,
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
    color: "#333333",
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
    backgroundColor: "#003366",
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
    color: "#FFFFFF",
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
})

