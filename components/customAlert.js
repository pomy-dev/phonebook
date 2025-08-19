import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({ visible, title, message, options, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {options?.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, opt.style === "cancel" && styles.cancelButton]}
              onPress={opt.onPress}
            >
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#60A5FA",
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default CustomAlert;
