import { State } from "react-native-gesture-handler";
import Animated, { clockRunning, startClock } from "react-native-reanimated";
// import { runSpring } from "react-native-redash";

const { Clock, Value, cond, eq, set, stopClock, spring: reSpring } = Animated;

export const spring = (
  translation: Animated.Value<number>,
  state: Animated.Value<State>,
  destination: Animated.Adaptable<number>
) => {
  const clock = new Clock();
  // http://chenglou.github.io/react-motion/demos/demo5-spring-parameters-chooser/
  const springConfig = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  };
  return cond(
    eq(state, State.END),
    set(translation, runSpring(clock, translation, destination, springConfig)),
    [cond(eq(state, State.BEGAN), stopClock(clock)), translation]
  );
};

export function runSpring(clock, value, dest, config) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    reSpring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export function runTheSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    reSpring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}