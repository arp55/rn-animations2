import * as React from "react";
import { View, StyleSheet } from "react-native";
import FIcon from "react-native-vector-icons/Feather";

interface CheckIconProps {
  color: string;
}

const CHECK_ICON_SIZE = 35;

export default ({ color: backgroundColor }: CheckIconProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FIcon name="check" color="white" size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CHECK_ICON_SIZE,
    height: CHECK_ICON_SIZE,
    borderRadius: CHECK_ICON_SIZE / 2,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});
