import { useEffect, useRef } from "react";
import Animated, { add, block, Clock, cond, neq, not, set, startClock, stopClock, timing, Value } from "react-native-reanimated";

type TimingConfig = Partial<Omit<Animated.TimingConfig, "toValue">>;

export const useTransition = (
  state: boolean | number,
  config: TimingConfig = {}
) => {
  const value: Animated.Value<number> = useConst(() => new Value(0));
  useEffect(() => {
    value.setValue(typeof state === "boolean" ? (state ? 1 : 0) : state);
  }, [value, state]);
  const transition = useConst(() => withTransition(value, config));
  return transition;
};

export const withTransition = (
  value: Animated.Node<number>,
  config: TimingConfig = {}
) => {
  const init = new Value(0);
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    frameTime: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  // const config = {
  //   toValue: new Value(0),
  //   duration: 150,
  //   easing: (v: Animated.Adaptable<number>) => add(v, 0),
  //   ...timingConfig,
  // };
  return block([
    cond(not(init), [set(init, 1), set(state.position, value)]),
    cond(neq(config.toValue, value), [
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(config.toValue, value),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

export function useConst<T>(initialValue: T | (() => T)): T {
  const ref = useRef<{ value: T }>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value:
        typeof initialValue === "function"
          ? // eslint-disable-next-line @typescript-eslint/ban-types
          (initialValue as Function)()
          : initialValue,
    };
  }
  return ref.current.value;
}