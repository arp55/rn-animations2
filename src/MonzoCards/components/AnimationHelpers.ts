/* eslint-disable import/prefer-default-export */
import Animated, { add, debug, Easing, not, set, spring, startClock, stopClock, timing as reTiming, Value,max as max2 } from "react-native-reanimated";

const { Clock, cond, block, eq, clockRunning } = Animated;

interface AnimateParams<S, C> {
  clock: Animated.Clock;
  fn: (
    clock: Animated.Clock,
    state: S,
    config: C
  ) => Animated.Adaptable<number>;
  state: S;
  config: C;
  from: Animated.Adaptable<number>;
}

interface TimingAnimation {
  state: Animated.TimingState;
  config: Animated.TimingConfig;
}

export interface TimingParams {
  clock?: Animated.Clock;
  from?: Animated.Adaptable<number>;
  to?: Animated.Adaptable<number>;
  duration?: Animated.Adaptable<number>;
  easing?: (v: Animated.Adaptable<number>) => Animated.Node<number>;
}

const animate = <T extends Animation>({
  fn,
  clock,
  state,
  config,
  from,
}: AnimateParams<T["state"], T["config"]>) =>
  block([
    cond(not(clockRunning(clock)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, from),
      startClock(clock),
    ]),
    fn(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);

export const runTiming = (params: TimingParams) => {
  const { clock, easing, duration, from, to } = {
    clock: new Clock(),
    duration: 250,
    from: 0,
    to: 1,
    easing: (v: Animated.Adaptable<number>) => add(v, 0),
    ...params,
  };

  const state: Animated.TimingState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    duration,
    easing,
  };

  return block([
    cond(not(clockRunning(clock)), [
      set(config.toValue, to),
      set(state.frameTime, 0),
    ]),
    animate<TimingAnimation>({
      clock,
      fn: reTiming,
      state,
      config,
      from,
    }),
  ]);
};

export function runSpring(clock,value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
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

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ]);
}

export const max = (...args: Animated.Adaptable<number>[]) =>
  args.reduce((acc, arg) => max2(acc, arg));

export const delay = (
  node: Animated.Node<number>,
  duration: number,
  nodeBefore: Animated.Adaptable<number> = 0
) => {
  const clock = new Clock();
  return block([
    runTiming(clock, 0, 1),
    cond(eq(clockRunning(clock), 0), node, nodeBefore)
  ]);
};
