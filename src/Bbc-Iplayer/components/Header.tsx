import * as React from "react";
import { View, StyleSheet } from "react-native";
import FIcon from "react-native-vector-icons/Feather";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default () => {
  return (
    <View style={styles.container}>
      <FIcon name="menu" color="white" size={24} />
      <FIcon name="search" color="white" size={24} />
    </View>
  );
};
