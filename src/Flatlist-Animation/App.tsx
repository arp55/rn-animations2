import React, { useRef } from 'react'
import { Dimensions, Image, StatusBar, StyleSheet, View, Animated } from 'react-native'
import data from './data'

const {height,width}=Dimensions.get('window')

//constants
const LOGO_WIDTH=220
const LOGO_HEIGHT=40
const DOT_SIZE=40
const TICKER_HEIGHT=40
const CIRCLE_SIZE=width*.55

type ItemProps={
    item:{
        type: string,
        imageUri: string,
        heading: string,
        description: string,
        key: string,
        color: string,
    },
    index:number;
    scrollX:Animated.Value;
}

type TickerProps={
    scrollX:Animated.Value;
}
type CircleProps={
    scrollX:Animated.Value;
}
type PaginationProps={
    scrollX:Animated.Value;
}

const Circle=({scrollX}:CircleProps)=>{
    return(
        <View style={[styles.circleContainer,StyleSheet.absoluteFillObject]}>
            {data.map((item,index)=>{
                const inputRange=[(index-.55)*width,index*width,(index+.55)*width]
                const scale=scrollX.interpolate({
                    inputRange,
                    outputRange:[0,1,0],
                    extrapolate:'clamp'
                })
                const opacity=scrollX.interpolate({
                    inputRange,
                    outputRange:[0.3,0.8,0.3]
                })
                return(
                    <Animated.View key={item.key} style={[styles.circle,{backgroundColor:item.color,opacity,transform:[{scale}]}]} />
                )
            })}
        </View>
    )
}

const Ticker=({scrollX}:TickerProps)=>{
    const inputRange=[-width,0,width]
    return(
        <View style={styles.tickerContainer}>
            <View>
                {data.map(item=>{
                    const translateY=scrollX.interpolate({
                        inputRange,
                        outputRange:[TICKER_HEIGHT,0,-TICKER_HEIGHT]
                    })
                    return(
                        <Animated.Text key={item.key} style={[styles.typeText,{transform:[{translateY}]}]}>{item.type}</Animated.Text>
                    )
                })}
            </View>
        </View>
    )
}

const Item = ({item,index,scrollX}:ItemProps) => {
    const {imageUri,heading,description,key}=item
    const inputRange=[(index-1)*width,index*width,(index+1)*width]
    const inputRangeOpacity=[(index-.3)*width,index*width,(index+.3)*width]
    const scale=scrollX.interpolate({
        inputRange,
        outputRange:[0,1,0]
    })
    const translateXHeading=scrollX.interpolate({
        inputRange,
        outputRange:[width*.2,0,-width*.2]
    })
    const translateXDesc=scrollX.interpolate({
        inputRange,
        outputRange:[width*.4,0,-width*.4]
    })
    const textOpacity=scrollX.interpolate({
        inputRange:inputRangeOpacity,
        outputRange:[0,1,0]
    })
    return(
        <View key={key} style={[styles.itemStyle]} >
            <Animated.Image source={imageUri} style={[styles.imageStyle,{transform:[{scale}]}]} />
            <View style={styles.textContainer} >
                <Animated.Text style={[styles.heading,{opacity:textOpacity,transform:[{translateX:translateXHeading}]}]}>{heading}</Animated.Text>
                <Animated.Text style={[styles.description,{opacity:textOpacity,transform:[{translateX:translateXDesc}]}]}>{description}</Animated.Text>
            </View>
        </View>
    )
}

const Pagination=({scrollX}:PaginationProps)=>{
    const translateX=scrollX.interpolate({
        inputRange:[-width,0,width],
        outputRange:[-DOT_SIZE,0,DOT_SIZE]
    })
    return(
        <View style={styles.pagination}>
            <Animated.View style={[styles.paginationCircle,{transform:[{translateX}]}]} />
            {data.map((item,index)=>{
                const inputRange=[(index-1)*width,index*width,(index+1)*width]
                const opacity=scrollX.interpolate({
                    inputRange,
                    outputRange:[1,0.4,1]
                })
                return(
                    <View key={item.key} style={styles.paginationDotContainer} >
                            <Animated.View style={[styles.paginationDot,{backgroundColor:item.color,opacity}]} />
                    </View>
                )
            })}
        </View>
    )
}

export default function App() {
    const scrollX= useRef(new Animated.Value(0)).current
    scrollX.addListener(({value})=>console.log(value))
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Ticker {...{scrollX}} />
            <Circle {...{scrollX}} />
            <Animated.FlatList
                data={data}
                keyExtractor={(item)=>item.key}
                renderItem={({item,index})=> <Item {...{item}} {...{index}} {...{scrollX}} /> }
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {
                        nativeEvent:{
                            contentOffset:{ x : scrollX }
                        }
                    }
                ],
                { useNativeDriver:true }
                )}
            />
            <Image
                source={require('./assets/ue_black_logo.png')}
                style={styles.logo}
            />
            <Pagination {...{scrollX}} />
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    itemStyle:{
        width,
        height,
        alignItems:'center',
        justifyContent:'center'
    },
    imageStyle:{
        width:width*.75,
        height:height*.75,
        resizeMode:'contain',
        flex:1,
    },
    textContainer:{
        alignItems:'flex-start',
        alignSelf:'flex-end',
        flex:0.5
    },
    heading: {
        color: '#444',
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
    },
    description: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'left',
        width: width * 0.75,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    logo:{
        opacity:0.9,
        height:LOGO_HEIGHT,
        width:LOGO_WIDTH,
        resizeMode:"contain",
        position:'absolute',
        left:10,
        bottom:10,
        transform:[
            {translateX:-LOGO_WIDTH/2},
            {translateY:-LOGO_HEIGHT/2},
            {rotateZ:'-90deg'},
            {translateX:LOGO_WIDTH/2},
            {translateY:LOGO_HEIGHT/2},
        ]
    },
    pagination:{
        position:'absolute',
        right:20,
        bottom:40,
        flexDirection:'row',
        height:DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationCircle:{
        position:'absolute',
        height:DOT_SIZE,
        width:DOT_SIZE,
        borderRadius:(DOT_SIZE)/2,
        borderWidth:1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#ccc'
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tickerContainer:{
        position:'absolute',
        top:50,
        left:20,
        height:TICKER_HEIGHT,
        overflow:'hidden'
    },
    typeText:{
        fontSize:TICKER_HEIGHT*.8,
        textTransform:'uppercase',
        fontWeight:'600'
    },
    circleContainer:{
        justifyContent:'center',
        alignItems:'center'
    },
    circle:{
        position:'absolute',
        top:'17%',
        height:CIRCLE_SIZE,
        width:CIRCLE_SIZE,
        borderRadius:CIRCLE_SIZE/2
    },
})