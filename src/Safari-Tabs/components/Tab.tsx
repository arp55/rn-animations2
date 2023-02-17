import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  View
} from "react-native";
import Animated, { abs, divide, Extrapolate, interpolate, multiply, sin, sub } from "react-native-reanimated";

import Content from "./Content";
import { TabModel, OVERVIEW } from "./Model";

const perspective = 1000;
const { height } = Dimensions.get("window");

interface TabProps {
  tab: TabModel;
  selectedTab: number;
  index: number;
  closeTab: () => void;
  selectTab: () => void;
  transition: Animated.Node<number>;
}

export default ({
  tab,
  transition,
  selectedTab,
  index,
  selectTab: onPress,
  closeTab
}: TabProps) => {
  const H = -height / 2;
  const position = index > selectedTab ? height : 0;
  const top = selectedTab === OVERVIEW ? index * 150 : position;
  const rotateX = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [-Math.PI / 6, 0],
    extrapolate: Extrapolate.CLAMP
  });
  const z = multiply(H, sin(abs(rotateX)));
  const transform = [
    { perspective },
    { rotateX },
    { scale: divide(perspective, sub(perspective, z)) }
  ];
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          height,
          top,
          transform
        }}
      >
        <Content {...{ closeTab, tab, selectedTab }} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
