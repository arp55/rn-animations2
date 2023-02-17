import { Value, Clock, cond, eq, stopClock, set, clockRunning, startClock, spring as reSpring } from 'react-native-reanimated';

export interface SpringValue {
  value: typeof Value;
  clock: Clock;
  hasSprung: typeof Value;
  hasSprungBack: typeof Value;
}

const springConfig = () => ({
  toValue: new Value(0),
  damping: 15,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
});

export const createValue = (val: number): SpringValue => ({
  value: new Value(val),
  clock: new Clock(),
  hasSprung: new Value(0),
  hasSprungBack: new Value(0),
});

export const springBack = (v: SpringValue, from: number, to: number): typeof Value => [
  cond(eq(v.hasSprung, 0), [
    stopClock(v.clock),
    set(v.hasSprung, 1),
  ]),
  spring(v, from, to, "hasSprungBack"),
];

export const spring = (
  v: SpringValue,
  from: number,
  to: number,
  back: "hasSprung" | "hasSprungBack" = "hasSprung",
): typeof Value => cond(eq(v[back], 0), [
  set(v.value, runSpring(v.clock, from, to, springConfig())),
  cond(eq(clockRunning(v.clock), 0), set(v[back], 1)),
]);

type Val = typeof Value | number;

export function runSpring(clock: Clock, value: Val, dest: Val, config: any) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    reSpring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}