import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { abs, concat, divide, Extrapolate, interpolate, multiply, sin, sub, Value } from 'react-native-reanimated'
import Task, { TASK_HEIGHT } from './Task'

interface NewTaskPartProps{
    task:string;
    scale:Value<number>;
    isOnTop?:boolean;
    backgroundColor:Value;
}

export default class NewTaskPart extends Component<NewTaskPartProps> {
    render() {
        const {task,scale,isOnTop,backgroundColor}= this.props
        const perspective=120
        const rotateX=interpolate(scale,{
            inputRange:[0,2],
            outputRange:[isOnTop?-Math.PI/2:Math.PI/2,0],
            extrapolate:Extrapolate.CLAMP
        })
        const translateZ=multiply(-TASK_HEIGHT/2,sin(abs(rotateX)))
        const opacity= interpolate(scale,{
            inputRange:[1,2],
            outputRange:[1,0],
            extrapolate:Extrapolate.CLAMP
        })
        return (
            <Animated.View style={[StyleSheet.absoluteFill,{
                transform:[
                    {perspective},
                    {rotateX:concat(rotateX,'rad')},
                    {scale:divide(perspective,sub(perspective,translateZ))}
                ]
            }]}>
                <Task {...{task}} backgroundColor={backgroundColor} />
                <Animated.View style={{...StyleSheet.absoluteFillObject,backgroundColor:'black',opacity}} />
            </Animated.View>
        )
    }
}

