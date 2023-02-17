import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";

import Tab from "./Tab";
import { TabsModel, OVERVIEW } from "./Model";
import Animated, { add, cond, diffClamp, Easing, eq, event, Extrapolate, interpolate, max, min, neq, set, sub, Transition, Transitioning, useValue, Value } from "react-native-reanimated";
import { useTransition, decay } from "react-native-redash/lib/module/v1";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

interface TabsProps {
  tabs: TabsModel;
}

export default ({ tabs: tabsProps }: TabsProps) => {
  const [tabs, setTabs] = useState([...tabsProps]);
  const [selectedTab, setSelectedTab] = useState(OVERVIEW);
  const ref = useRef(null)
  const config = {
    toValue: neq(selectedTab, OVERVIEW),
    duration: 400,
    easing: Easing.inOut(Easing.ease)
  }

  const transition = <Transition.Change interpolation="easeIn" durationMs={200} />
  const transitionVal = useTransition(selectedTab, eq(selectedTab, OVERVIEW), neq(selectedTab, OVERVIEW), 400, Easing.linear)

  const { translateY, onGestureEvent } = useMemo(() => {
    const translationY = new Value(0)
    const velocityY = new Value(0)
    const offsetY = new Value(0)
    const state = new Value(State.UNDETERMINED)
    const translateY1 = diffClamp(cond(eq(state, State.END), [set(offsetY, add(offsetY, translationY))], add(offsetY, translationY)), -tabs.length * 150, 0)
    // cond(eq(state, State.END), [set(offsetY, add(offsetY, translationY))], add(offsetY, translationY))
    return {
      translateY: translationY,
      onGestureEvent: event([{
        nativeEvent: {
          translationY,
          state
        }
      }],
        { useNativeDriver: true }
      )
    }
  }
    , [])


  return (
    <View
      style={{
        backgroundColor: "black",
        height: tabsProps.length * height
      }}
    >
      <PanGestureHandler {...{ onGestureEvent }} onHandlerStateChange={onGestureEvent}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Transitioning.View {...{ ref, transition }} style={StyleSheet.absoluteFill}>
            {tabs.map((tab, index) => (
              <Tab
                transition={transitionVal}
                key={tab.id}
                closeTab={() => {
                  setTabs([...tabs.slice(0, index), ...tabs.slice(index + 1)]);
                }}
                selectTab={() => {
                  if (ref.current) {
                    ref.current.animateNextTransition()
                  }
                  setSelectedTab(selectedTab === index ? OVERVIEW : index);
                }}
                {...{ tab, selectedTab, index }}
              />
            ))}
          </Transitioning.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
