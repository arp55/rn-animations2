import React, { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";

import TabIcon from "./TabIcon";
import Player from "./Player";
import MiniPlayer from "./MiniPlayer";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { abs, add, and, block, Clock, clockRunning, cond, eq, event, interpolate, max, min, multiply, neq, not, proc, set, spring as reSpring, startClock, stopClock, sub, useCode, Value } from "react-native-reanimated";

const { height } = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 50;
const MINIMIZED_PLAYER_HEIGHT = 42;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
// const config = {
//   damping: 15,
//   mass: 1,
//   stiffness: 150,
//   overshootClamping: false,
//   restSpeedThreshold: 0.1,
//   restDisplacementThreshold: 0.1
// };

export const clamp = proc(
  (
    value: Animated.Adaptable<number>,
    lowerBound: Animated.Adaptable<number>,
    upperBound: Animated.Adaptable<number>
  ): Animated.Node<number> => min(max(lowerBound, value), upperBound)
);

export const snapPoint = (
  value: Animated.Adaptable<number>,
  velocity: Animated.Adaptable<number>,
  points: Animated.Adaptable<number>[]
) => {
  const point = add(value, multiply(0.2, velocity));
  const diffPoint = (p: Animated.Adaptable<number>) => abs(sub(point, p));
  const deltas = points.map((p) => diffPoint(p));
  const minDelta = min(...deltas);
  return points.reduce(
    (acc, p) => cond(eq(diffPoint(p), minDelta), p, acc),
    new Value()
  ) as Animated.Node<number>;
};

const config = {
  toValue: new Value(0),
  damping: 20,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

function runAnimation(value,velocity,state,snapPoints,offset){
  const clock = new Clock();
  const springState: Animated.SpringState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const gestureAndAnimationIsOver = new Value(1);
  const isSpringInterrupted = and(eq(state, State.BEGAN), clockRunning(clock));
  const finishSpring = [
    set(offset, springState.position),
    stopClock(clock),
    set(gestureAndAnimationIsOver, 1),
  ];
  const snap = [];
  return block([
    cond(isSpringInterrupted, finishSpring),
    cond(gestureAndAnimationIsOver, set(springState.position, offset)),
    cond(neq(state, State.END), [
      set(gestureAndAnimationIsOver, 0),
      set(springState.finished, 0),
      set(springState.position, add(offset, value)),
    ]),
    cond(and(eq(state, State.END), not(gestureAndAnimationIsOver)), [
      cond(and(not(clockRunning(clock)), not(springState.finished)), [
        set(springState.velocity, velocity),
        set(springState.time, 0),
        set(
          config.toValue,
          snapPoint(springState.position, velocity, snapPoints)
        ),
        startClock(clock),
      ]),
      reSpring(clock, springState, config),
      cond(springState.finished, [...snap, ...finishSpring]),
    ]),
    springState.position,
  ]);
}

function runSpring(clock,value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    reSpring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ]);
}

const styles = StyleSheet.create({
  playerSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "cyan",
    // zIndex:10
  },
  container: {
    backgroundColor: "#272829",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TABBAR_HEIGHT,
    flexDirection: "row",
    borderTopColor: "black",
    borderWidth: 1
  }
});

export default () => {
  const clock = new Clock();
  const translationY=new Value(0)
  const velocityY=new Value(0)
  const offset=new Value(SNAP_BOTTOM)
  const state=new Value(State.UNDETERMINED)

  const goUp:Animated.Value<0|1>=new Value(0)
  const goDown:Animated.Value<0|1>=new Value(1)

  const translateY = clamp(runAnimation(translationY,velocityY,state,[SNAP_TOP,SNAP_BOTTOM],offset),SNAP_TOP,SNAP_BOTTOM);
  const translateBottomTab = interpolate(translateY,{
    inputRange:[SNAP_BOTTOM-TABBAR_HEIGHT,SNAP_BOTTOM],
    outputRange:[TABBAR_HEIGHT,0],
    
  });

  const onGestureEvent=event([
    {
      nativeEvent:{
        translationY,
        velocityY,
        state
      }
    }
  ],{ useNativeDriver: true})

  useCode(()=>[
    cond(goUp,[runSpring(clock,offset,SNAP_TOP),cond(not(clockRunning(clock)),set(goUp,0))]),
    cond(goDown,[runSpring(clock,offset,SNAP_BOTTOM),cond(not(clockRunning(clock)),set(goDown,0))]),
  ],[goUp,goDown])

  const opacity=interpolate(translateY,{
    inputRange:[SNAP_BOTTOM-MINIMIZED_PLAYER_HEIGHT,SNAP_BOTTOM],
    outputRange:[0,1]
  })

  const overlayOpacity=interpolate(translateY,{
    inputRange:[SNAP_BOTTOM-MINIMIZED_PLAYER_HEIGHT*2,SNAP_BOTTOM-MINIMIZED_PLAYER_HEIGHT],
    outputRange:[0,1]
  })

  return (
    <>
      <PanGestureHandler {...{onGestureEvent}} onHandlerStateChange={onGestureEvent}>
          <Animated.View style={[styles.playerSheet, { transform: [{ translateY }] }]}>
            <Player onPress={() => goDown.setValue(1)} />
            <Animated.View pointerEvents="none" style={{...StyleSheet.absoluteFillObject,opacity:overlayOpacity,backgroundColor:'#272829'}} />
            <Animated.View
              style={{
                opacity,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: MINIMIZED_PLAYER_HEIGHT
              }}
            >
              <MiniPlayer />
            </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={{ transform: [{ translateY: translateBottomTab }] }}>
        <SafeAreaView style={styles.container}>
          <TabIcon name="home" label="Home" />
          <TabIcon name="search" label="Search" />
          <TabIcon
            name="chevron-up"
            label="Player"
            onPress={() => goUp.setValue(1)}
          />
        </SafeAreaView>
      </Animated.View>
    </>
  );
};
