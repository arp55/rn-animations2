import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, Text, Platform } from 'react-native'
import Animated, { concat, Extrapolate, interpolate, Value } from 'react-native-reanimated'
import Interactable from '../../Chrome-Refresh/components/Interactable'

const { height, width } = Dimensions.get('window')

interface StoryProps {
    front: string;
    back: string;
    bottom?: boolean;
    onSnap: (id: number) => void;
}
interface StoryState {
    isDragging: boolean;
}

export default class Story extends Component<StoryProps> {
    static defaultProps = {
        bottom: false
    }
    state = {
        isDragging: false
    }
    y = new Value(0)

    onDrag = () => {
        const { isDragging } = this.state
        if (!isDragging) {
            this.setState({ isDragging: true })
        }
    }

    onSnap = ({ nativeEvent: { id } }: { nativeEvent: { id: number } }) => {
        const { onSnap } = this.props
        onSnap(id)
    }

    render() {
        const { bottom } = this.props
        const { isDragging } = this.state
        const { y, onDrag, onSnap } = this
        const snapPoints = bottom ? [{ y: -height / 2, id: 1 }, { y: 0, id: 0 }] : [{ y: 0, id: 0 }, { y: height / 2, id: -1 }]
        const { back, front } = this.props
        const inputRange = bottom ? [-height / 2, 0] : [0, height / 2]
        const outputRange = bottom ? [180, 0] : [0, -180]
        const rotateXDeg = interpolate(y, {
            inputRange,
            outputRange,
            extrapolate: Extrapolate.CLAMP
        })
        const rotateX = concat(rotateXDeg, 'deg')
        const coef = bottom ? -1 : 1
        const perspective = 1000
        const zIndex = Platform.OS === "android" ? "elevation" : "zIndex"
        return (
            <View style={{ flex: 1, [zIndex]: isDragging ? 1 : 0 }}>
                {/* <View style={{ flex: 1 }}> */}
                <Animated.View style={[StyleSheet.absoluteFill, {
                    backgroundColor: 'white',
                    padding: 10,
                    transform: [
                        { perspective },
                        { translateY: coef * height / 4 },
                        { rotateX },
                        { translateY: coef * -height / 4 },
                        { rotateY: '180deg' },
                        { rotateZ: '180deg' },
                    ]
                }]}>
                    <Text style={{ textAlign: 'justify', fontSize: 24 }}>{back}</Text>
                </Animated.View>
                <Animated.View style={[StyleSheet.absoluteFill,
                {
                    backgroundColor: 'white',
                    backfaceVisibility: 'hidden',
                    // justifyContent: 'flex-end',
                    padding: 10,
                    transform: [
                        { perspective },
                        { translateY: coef * height / 4 },
                        { rotateX },
                        { translateY: coef * -height / 4 }
                    ]
                }]}>
                    <Text style={{ textAlign: 'justify', fontSize: 24 }}>{front}</Text>
                </Animated.View>
                {/* </View> */}
                <Interactable
                    style={{ ...StyleSheet.absoluteFillObject }}
                    verticalOnly
                    animatedValueY={y}
                    {...{ snapPoints, onDrag, onSnap }}
                />
            </View>
        )
    }
}
