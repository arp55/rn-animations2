import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import Animated, { add, block, cond, debug, eq, event, Extrapolate, interpolate, max, min, set, sub, useCode, useValue, Value } from 'react-native-reanimated';

const { height, width } = Dimensions.get("window")
const blockHeight = height * .45

export default function Pan() {
    const translationY = new Value(0)
    const offsetY = useValue(0)
    const gestureState = new Value(State.UNDETERMINED)

    const onGestureEvent = event([{
        nativeEvent: {
            translationY,
            state: gestureState
        },
    }], { useNativeDriver: true });

    // useCode(() => block([
    //     // cond(eq(gestureState, State.BEGAN), [set(translationY, add(translationY, offsetY)),debug('offsetY', translationY)]),

    // ]), [])

    const translateY = min(max(cond(eq(gestureState, State.END), set(offsetY, add(offsetY, translationY)), add(offsetY, translationY)), 0), sub(height, blockHeight))
    // const translateY=min(max(translationY,0),height)

    return (
        <View style={{ flex: 1 }}>
            <PanGestureHandler {...{ onGestureEvent }} onHandlerStateChange={onGestureEvent}>
                <Animated.View style={{ height: blockHeight, backgroundColor: 'red', width: width, transform: [{ translateY }] }}>
                    <Text>PanGesture</Text>
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}