import React, { useMemo, useRef } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { WebView } from 'react-native-webview';
import Constants from "expo-constants";
import { TabModel, OVERVIEW } from "./Model";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { abs, and, call, Clock, clockRunning, cond, debug, eq, event, greaterOrEq, greaterThan, lessThan, set, spring, startClock, stopClock, useCode, Value } from "react-native-reanimated";
import { runTheSpring } from "./Spring";
import { snapPoint } from "react-native-redash/lib/module/v1";
import { approximates } from "react-native-redash/lib/module/v1";

const { width } = Dimensions.get("window");
const EXTREMITY = width * 2.1;
const snapPoints = [-EXTREMITY, 0, EXTREMITY];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden"
  },
  title: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center"
  },
  webView: {
    flex: 1,
  }
});

interface ContentProps {
  tab: TabModel;
  closeTab: () => void;
  selectedTab: number;
}

export default ({ tab: { uri, id: title }, selectedTab, closeTab }: ContentProps) => {
  const offset = selectedTab === OVERVIEW ? 0 : Constants.statusBarHeight;
  const clock = new Clock()

  const { onGestureEvent, translateX, velocityX, state } = useMemo(() => {
    const translationX = new Value(0)
    const velocityX = new Value(0)
    const state = new Value(State.UNDETERMINED)
    return {
      translateX: translationX,
      velocityX,
      state,
      onGestureEvent: event([{
        nativeEvent: {
          translationX,
          velocityX,
          state
        }
      }],
        { useNativeDriver: true }
      )
    }
  }, [])

  useCode(() => [
    cond(eq(state, State.END), [cond(and(greaterThan(translateX, 40), greaterThan(velocityX, 200)), set(translateX, runTheSpring(clock, translateX, width)), [cond(and(lessThan(translateX, -40), lessThan(velocityX, -200)), set(translateX, runTheSpring(clock, translateX, -width)), set(translateX, runTheSpring(clock, translateX, 0)))])]),
    cond(approximates(abs(translateX), width), call([], closeTab))
  ], [closeTab])

  // set(translateX, runSpring(clock, translateX, EXTREMITY)), 
  // spring(translationX, state, snapPoint(translationX, velocityX, snapPoints))

  return (
    <PanGestureHandler {...{ onGestureEvent }} onHandlerStateChange={onGestureEvent}>
      <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
        <View
          style={{
            paddingTop: offset,
            height: 32 + offset,
            backgroundColor: "#fefefe",
            justifyContent: "center"
          }}
        >
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.webView}>
          {/* <WebView source={{ uri }} style={styles.webView} automaticallyAdjustContentInsets={false} /> */}
          <View style={{ flex: 1, backgroundColor: '#2c8dc9' }} />
          <View style={StyleSheet.absoluteFill} />
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};
