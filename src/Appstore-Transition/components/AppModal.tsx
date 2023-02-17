import * as React from "react";
import { Dimensions, View } from "react-native";

import AppThumbnail from "./AppThumbnail";
import { App, Position } from "./Model";
import Content from "./Content";
import SwipeToClose from "./SwipeToClose";
import { createValue, spring, springBack } from './Spring'
import Animated, { add, block, call, clockRunning, cond, debug, divide, greaterOrEq, greaterThan, not, round, sub, Value } from "react-native-reanimated";

const { width: wWidth, height: wHeight } = Dimensions.get("window");

export interface AppModalProps {
  app: App;
  position: Position;
  close: () => void;
}

export default ({ app, position, close }: AppModalProps) => {
  console.log(position.width)
  const width = createValue(position.width)
  const height = createValue(position.height)
  const x = createValue(position.x)
  const y = createValue(position.y)
  const borderRadius = createValue(8);
  const opacity = createValue(0);
  const scale = createValue(0);
  const textOpacity = cond(greaterThan(width.value, add(position.width, divide(sub(wWidth, position.width), 2))), 1, 0)
  const translationY = new Value(0)
  const p = {
    position: "absolute",
    width: width.value,
    height: height.value,
    left: x.value,
    top: y.value,
  };

  const shouldClose = greaterOrEq(round(translationY), 100)

  return (
    <SwipeToClose y={translationY} opacity={opacity.value} {...{ scale }}>
      <Animated.Code>
        {
          () => block([
            cond(shouldClose, [
              springBack(width, wWidth, position.width),
              springBack(height, wHeight, position.height),
              springBack(x, 0, position.x),
              springBack(y, 0, position.y),
              springBack(borderRadius, 0, 8),
              springBack(opacity, 1, 0),
              springBack(scale, .75, 1),
              cond(not(clockRunning(scale.clock)), call([], close))
            ],
              [
                spring(width, position.width, wWidth),
                spring(height, position.height, wHeight),
                spring(x, position.x, 0),
                spring(y, position.y, 0),
                spring(borderRadius, 8, 0),
                spring(opacity, 0, 1)
              ])
          ])
        }
      </Animated.Code>
      <Animated.View
        style={{
          backgroundColor: "white",
          ...p,
        }}
      />
      <Animated.View
        style={{
          opacity: textOpacity,
          paddingTop: position.height,
          ...p,
        }}
      >
        <Content />
      </Animated.View>
      <Animated.View
        style={{
          ...p,
          height: position.height,
        }}
      >
        <AppThumbnail borderRadius={borderRadius.value} {...{ app }} />
      </Animated.View>
    </SwipeToClose>
  );
};
