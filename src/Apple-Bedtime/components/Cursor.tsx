import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { add, block, cond, cos, eq, event, multiply, set, sin, sub, Value } from 'react-native-reanimated'
import { atan2 } from './Math'

interface CursorProps {
    radius: number;
    angle: typeof Value;
}

export default function Cursor({ radius, angle }: CursorProps) {
    const α = new Value(0)
    const translationX = new Value(0)
    const translationY = new Value(0)
    const offsetX = new Value(0)
    const offsetY = new Value(0)
    const x = new Value(0)
    const y = new Value(0)
    const translateX = new Value(0)
    const translateY = new Value(0)
    const state = new Value(State.UNDETERMINED)
    const onGestureEvent = event([
        {
            nativeEvent: {
                translationX,
                translationY,
                state
            }
        }
    ],
        // { useNativeDriver: true }
    )

    return (
        <>
            <Animated.Code>
                {
                    () => block([
                        cond(eq(state, State.ACTIVE), [
                            set(x, add(offsetX, translationX)),
                            set(y, add(offsetY, translationY))
                        ]),
                        cond(eq(state, State.END), [
                            set(offsetX, x),
                            set(offsetY, y)
                        ]),
                        set(α, atan2(sub(multiply(y, -1), radius), sub(x, radius))),
                        set(angle, α),
                        set(translateX, add(multiply(radius, cos(α)), radius)),
                        set(translateY, add(multiply(-1 * radius, sin(α)), radius)),
                    ])
                }
            </Animated.Code>
            <PanGestureHandler {...{ onGestureEvent }} onHandlerStateChange={onGestureEvent}>
                <Animated.View style={[styles.container, { transform: [{ translateX }, { translateY }] }]} />
            </PanGestureHandler>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white'
    }
})