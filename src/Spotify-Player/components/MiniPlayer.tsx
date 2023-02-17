import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FIcon from "react-native-vector-icons/Feather";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272829",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
  },
  text: {
    color: "white"
  }
});

export default () => {
  return (
    <View style={styles.container}>
      <FIcon name="heart" color="white" size={24} />
      <Text style={styles.text}>Metronomy - The Bay</Text>
      <FIcon name="play-circle" color="white" size={24} />
    </View>
  );
};
