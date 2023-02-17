import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Value } from 'react-native-reanimated'
import NewTaskPart from './NewTaskPart'
import { TASK_HEIGHT } from './Task'

interface NewTaskProps{
    translateY:Value<number>;
    task:string;
    scale:Value<number>;
    backgroundColor:Value;
}

export default class NewTask extends Component <NewTaskProps>{
    render() {
    const {translateY,scale,task,backgroundColor}=this.props
    return (
            <Animated.View style={[styles.container,{transform:[{translateY}]}]}>
                <NewTaskPart isOnTop {...{scale,task,backgroundColor}} />
                <NewTaskPart {...{scale,task,backgroundColor}} />
            </Animated.View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        height:TASK_HEIGHT
    }
})
