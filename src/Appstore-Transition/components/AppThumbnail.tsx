import * as React from "react";
import {
  View, StyleSheet, Text, Image,
} from "react-native";
import Animated, { Value } from "react-native-reanimated";
import { Constants } from "react-native-unimodules";

import { App } from "./Model";

interface AppThumbnailProps {
  app: App;
  borderRadius?: typeof Value;
}

export default ({ app: { source, title, subtitle }, borderRadius }: AppThumbnailProps) => (
  <>
    <Animated.Image
      style={[styles.image, { borderRadius: borderRadius || 8 }]}
      {...{ source }}
    />
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "space-between",
  },
  title: {
    color: "white",
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 18,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
