// @ts-ignore
import { Shape, Surface, Path, Group } from '@react-native-community/art'
import React from 'react'
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View,Text, SafeAreaView } from 'react-native'
import StyleGuide from './StyleGuide'

const {height:wHeight,width:wWidth}=Dimensions.get('window')

const radius =75
const width=wWidth*3
const height=wHeight*3
//calculation for circle center
const xc=wWidth+radius
const yc=wHeight+radius

export interface Steps{
    x:number;
    y:number;
    label:string;
}

type IntroProps={
    steps:Steps[]
}

interface IntroState{
    index:number;
}

//path def for rect
// const rPath=new Path().moveTo(0, 0).lineTo(width,0).lineTo(width,height).lineTo(0,height).lineTo(0,0).close() 
const cPath=new Path().moveTo(xc-radius,yc).arcTo(xc,yc-radius,radius).arcTo(xc+radius,yc,radius).arcTo(xc,yc+radius,radius).arcTo(xc-radius,yc,radius)

class Intro extends React.Component<IntroProps,IntroState> {
    x=new Animated.Value(0)
    y=new Animated.Value(0)
    state={
        index:-1
    }

    componentDidMount(){
        this.nextStep()
    }

    nextStep=()=>{
        console.log(this.props)
        const {steps}=this.props
        const {index}=this.state
        if((index+1)===steps.length){
            this.setState({index:-1})
        }else{
            this.setState({index:index+1})
            const {x,y}=steps[index+1]
            Animated.parallel([
                Animated.timing(this.x,{
                    toValue:x,
                    duration:300,
                    useNativeDriver:true
                }),
                Animated.timing(this.y,{
                    toValue:y,
                    duration:300,
                    useNativeDriver:true
                }),
            ]).start()
        }
    }

    render(){
        const {x,y}=this
        const {index}=this.state
        const {steps}=this.props
        const step=steps[index]
        if(index===-1){
            return null
        }
        return (
            <>
                <Animated.View style={[styles.container,{transform:[{translateX:x},{translateY:y}]}]}>
                    <Surface width={wWidth*3} height={wHeight*3} style={styles.surface}>
                        <Group>
                            <Shape d={cPath} fill="#ffffff90" />
                        </Group>
                    </Surface>
                </Animated.View>
                <View style={styles.overlay}>
                    <SafeAreaView>
                        <Text style={styles.text}>{step.label}</Text>
                        <TouchableWithoutFeedback onPress={this.nextStep}>
                            <View style={styles.button}>
                                <Text style={styles.text}>Got it</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </View>
            </>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        position:'absolute',
        top:-wHeight,
        left:-wWidth,
        width,
        height,
    },
    surface:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor:"#5297a3A1",
    },
    overlay:{
        ...StyleSheet.absoluteFillObject,
        justifyContent:'flex-end',
        padding:StyleGuide.spacing.base
    },
    button:{
        borderWidth:2,
        borderRadius:5,
        borderColor:'white',
        marginTop:StyleGuide.spacing.base,
        padding:StyleGuide.spacing.base
    },
    text:{
        color:'white',
        ...StyleGuide.typography.title3,
        textAlign:'center'
    }
})

export default Intro
