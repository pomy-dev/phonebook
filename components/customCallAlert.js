import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { AppContext } from "../context/appContext";

export function useCallFunction() {
  const { theme } = React.useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleCall = (phoneNumbers, businessName = "Business") => {
    if (!phoneNumbers || phoneNumbers.length === 0) {
      setTitle("No Number");
      setMessage("This business has no phone number available.");
      setOptions([{ text: "OK", onPress: () => setVisible(false) }]);
      setVisible(true);
      return;
    }

    if (phoneNumbers.length === 1) {
      Linking.openURL(`tel:${phoneNumbers[0].number}`);
    } else {
      const opts = phoneNumbers.map((phone) => ({
        text: `${phone.phone_type}: ${phone.number}`,
        onPress: () => {
          setVisible(false);
          Linking.openURL(`tel:${phone.number}`);
        },
      }));

      opts.push({ text: "Cancel", onPress: () => setVisible(false), style: "cancel" });

      setTitle("Select Phone Number");
      setMessage(`Call ${businessName}`);
      setOptions(opts);
      setVisible(true);
    }
  };

  // expose UI for rendering
  const AlertUI = () => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: theme.colors.text }]}>{message}</Text> : null}

          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
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

  return { handleCall, AlertUI };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 15,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#003366",
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: "#f31919ff",
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
