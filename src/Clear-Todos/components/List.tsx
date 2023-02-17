import interpolate from "color-interpolate";
import * as React from "react";
import { View, StyleSheet } from "react-native";

import Header, { HEADER_HEIGHT } from "./Header";
import Task, { TASK_HEIGHT } from "./Task";
import { runSpring, interpolateColors } from "./AnimatedHelpers";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import Animated, { block, Clock, cond, debug, divide, eq, event, lessThan, multiply, round, set, sub, Value } from "react-native-reanimated";
import NewTask from "./NewTask";

interface ListProps {
  tasks: string[];
}

const colors = ["#C52B27", "#E1B044"];
const palette = interpolate(colors);

export default class List extends React.PureComponent<ListProps> {
  render() {
    const { tasks } = this.props;
    const step = 1 / tasks.length;
    const clock=new Clock()
    const rawScale=new Value(0)
    const rawFocalY=new Value(0)
    const scale=new Value(0)
    const focalY=new Value(0)
    const state=new Value(State.UNDETERMINED)
    const onGestureEvent= event(
      [{ nativeEvent: { scale: rawScale, focalY:rawFocalY,state } }],
    );
    const index=round(divide(focalY,TASK_HEIGHT))
    const scaleFactor=multiply(scale,(TASK_HEIGHT/4))
    const backgroundColor=interpolateColors(
      multiply(step,index),
      [0,1],
      colors
    )
    return (
      <View style={styles.container}>
        <Animated.Code>
          {
            ()=>block([
              cond(eq(state,State.BEGAN),set(focalY,rawFocalY)),
              set(scale,cond(eq(state,State.END),runSpring(clock,rawScale,0),rawScale)),
              debug('scale',scale),
              debug('focalY',focalY),
            ])
          }
        </Animated.Code>
        <Header />
        <PinchGestureHandler
          {...{onGestureEvent}}
          onHandlerStateChange={onGestureEvent}
        >
        <Animated.View>
          <NewTask translateY={sub(multiply(index,TASK_HEIGHT),TASK_HEIGHT/2)} {...{scale,backgroundColor}} task="Pinch to create a new task" />
          {
            tasks.map((task, key) => {
              const bgColor = palette(step * key);
              const isOnTop=lessThan(key,index)
              const translateY=multiply(scaleFactor,cond(isOnTop,-1,1))
              return (
                <Animated.View {...{ key }} style={{transform:[{translateY}]}}>
                  <Task
                    backgroundColor={bgColor}
                    {...{ task }}
                  />
                </Animated.View>
              );
            })
          }
        </Animated.View>
        </PinchGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
