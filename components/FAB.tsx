import { Mic, Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const FAB = ({ onPressAdd, onPressVoice, isListening }) => {
  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        style={[
          styles.fab,
          styles.fabVoice,
          isListening && styles.fabListening,
        ]}
        onPress={onPressVoice}
        disabled={isListening}
      >
        <Mic size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.fab, styles.fabAdd]}
        onPress={onPressAdd}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    gap: 15,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabAdd: {
    backgroundColor: "#3b82f6",
  },
  fabVoice: {
    backgroundColor: "#8b5cf6",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fabListening: {
    backgroundColor: "#ef4444",
  },
});

export default FAB;
