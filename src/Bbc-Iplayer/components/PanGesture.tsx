import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { add, ceil, Clock, clockRunning, cond, debug, diff, divide, eq, event, floor, modulo, Node, not, set, stopClock, sub, useCode, useValue, Value } from 'react-native-reanimated'
import { runTheSpring } from '../../Safari-Tabs/components/Spring'
import { snapPoint } from '../../Spotify-Player/components/BottomTab'

interface PanGestureProps {
    index: Value<number>;
    ratio: number;
    length: number;
}

export const withOffset = (
    value: Animated.Node<number>,
    state: Animated.Node<State>,
    offset: Animated.Value<number> = new Value(0)
) =>
    cond(
        eq(state, State.END),
        [set(offset, add(offset, value)), offset],
        add(offset, value)
    );


export default function PanGesture({ index, length, ratio }: PanGestureProps) {
    const clock = new Clock()
    const shouldSnap = new Value(0)
    const translationX = new Value(0)
    const offsetX = useValue(0)
    const velocityX = new Value(0)
    const state = new Value(State.UNDETERMINED)
    const onGestureEvent = event([{
        nativeEvent: {
            translationX,
            velocityX,
            state
        }
    }],
        { useNativeDriver: true }
    )
    const translateX = withOffset(translationX, state)
    // const translateX = cond(eq(state, State.END), set(offsetX, add(offsetX, translationX)), add(offsetX, translationX))
    const increment = divide(diff(translateX), ratio)
    const setIndex = (value: Node<number>) => set(index, modulo(value, length))
    useCode(() => [
        setIndex(sub(index, increment)),
        cond(eq(state, State.BEGAN), stopClock(clock)),
        cond(eq(state, State.END), [
            set(shouldSnap, 1),
            set(state, State.UNDETERMINED), //giving issue of offsetX
        ]),
        cond(eq(shouldSnap, 1), [
            setIndex(
                runTheSpring(clock, index, snapPoint(index, divide(velocityX, -ratio), [ceil(index), floor(index)]))
            ),
            debug('index', index),
            cond(not(clockRunning(clock)), set(shouldSnap, 0))
        ]),
    ], [])
    return (
        <PanGestureHandler {...{ onGestureEvent }} onHandlerStateChange={onGestureEvent}>
            <Animated.View style={[StyleSheet.absoluteFill]} />
        </PanGestureHandler>
    )
}
