import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import Animated, { abs, add, and, block, Clock, clockRunning, cond, debug, eq, greaterOrEq, greaterThan, interpolate, lessOrEq, lessThan, not, set, sub, Value } from 'react-native-reanimated'
import { Ellipse, Svg } from 'react-native-svg'
import { runTiming } from './AnimationHelpers'

const AnimatedEllipse=Animated.createAnimatedComponent(Ellipse)

const {width}=Dimensions.get('window')
const height=64

type CursorProps={
    size:number;
    index:Value<number>;
    x:Value<number>;
    segment:number;
}

export default class Cursor extends Component<CursorProps> {
    center=new Value(0)
    transitioningLeft=new Value(0)
    transitioningRight=new Value(0)
    clockIndex=new Clock()
    clockCenter=new Clock()
    render() {
        const {center,transitioningLeft,transitioningRight,clockIndex,clockCenter}=this
        const {size,x,segment,index}= this.props
        const middle=width/2
        const offset=sub(x,center)
        const origin=interpolate(index,{
            inputRange:[0,1,2],
            outputRange:[middle-segment-size,middle,middle+segment+size],
        })
        const cx=add(origin,offset)
        const rx=add(size,abs(offset))
        const thresholdRight=sub(add(center,segment),size);
        const thresholdLeft=add(sub(center,segment),size)
        const canGoLeft=greaterThan(index,0)
        const canGoRight=lessThan(index,2)
        return (
            <>
                <Animated.Code>
                    {
                        ()=>block([
                            cond(and(greaterOrEq(x,thresholdRight),canGoRight),set(transitioningRight,1)),
                            cond(and(lessOrEq(x,thresholdLeft),canGoLeft),set(transitioningLeft,1)),
                            cond(eq(transitioningRight,1),[
                                set(index,runTiming(clockIndex,index,add(center,1))),
                                set(center,runTiming(clockCenter,center,x)),
                                cond(not(clockRunning(clockIndex)),set(transitioningRight,0))
                            ]),
                            cond(eq(transitioningLeft,1),[
                                set(index,runTiming(clockIndex,index,sub(center,1))),
                                set(center,runTiming(clockCenter,center,x)),
                                cond(not(clockRunning(clockIndex)),set(transitioningLeft,0))
                            ])
                            // debug('index',index)
                        ])
                    }
                </Animated.Code>
                <Svg {...{width,height}}>
                    <AnimatedEllipse
                        cx={cx}
                        cy={size}
                        rx={rx}
                        ry={size}
                        fill='gray'
                    />
                </Svg>
            </>
        )
    }
}
