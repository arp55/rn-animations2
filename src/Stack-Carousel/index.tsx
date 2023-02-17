import React, { useCallback, useEffect, useState } from 'react'
import { Animated, Dimensions, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/EvilIcons'

const { width }=Dimensions.get("window")

interface Data{
    title: string,
    location: string,
    date: string,
    poster: string
}

type Datas=Array<Data>

const DATA:Datas = [
    {
        title: 'Afro vibes',
        location: 'Mumbai, India',
        date: 'Nov 17th, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/07/Afro-vibes-flyer-template.jpg',
    },
    {
        title: 'Jungle Party',
        location: 'Unknown',
        date: 'Sept 3rd, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2019/11/Jungle-Party-Flyer-Template-1.jpg',
    },
    {
        title: '4th Of July',
        location: 'New York, USA',
        date: 'Oct 11th, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/4th-Of-July-Invitation.jpg',
    },
    {
        title: 'Summer festival',
        location: 'Bucharest, Romania',
        date: 'Aug 17th, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/07/Summer-Music-Festival-Poster.jpg',
    },
    {
        title: 'BBQ with friends',
        location: 'Prague, Czech Republic',
        date: 'Sept 11th, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/BBQ-Flyer-Psd-Template.jpg',
    },
    {
        title: 'Festival music',
        location: 'Berlin, Germany',
        date: 'Apr 21th, 2021',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/Festival-Music-PSD-Template.jpg',
    },
    {
        title: 'Beach House',
        location: 'Liboa, Portugal',
        date: 'Aug 12th, 2020',
        poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/Summer-Beach-House-Flyer.jpg',
    },
];
  
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;

const OverFlowItems=({data,scrollXAnimated}:{data:Datas,scrollXAnimated:Animated.Value})=>{
    const inputRange=[-1,0,1]
    const translateY=scrollXAnimated.interpolate({
        inputRange,
        outputRange:[OVERFLOW_HEIGHT,0,-OVERFLOW_HEIGHT]
    })
    return(
        <View style={styles.overflowContainer}>
            <Animated.View style={{transform:[{translateY}]}}>
                {data.map((item,index)=>{
                    return(
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.title}>
                                {item.title}
                            </Text>
                            <View style={styles.itemContainerRow}>
                                <Text style={styles.location}>
                                    <Icon 
                                    name="location"
                                    size={16}
                                    color="black"
                                    style={{marginRight:5}}
                                    />
                                    {item.location}
                                </Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                        </View>
                    )
                })}
            </Animated.View>
        </View>
    )
}

export default function App() {
    const [data, setData] = useState(DATA)
    const [index, setIndex] = useState(0)
    const scrollXIndex=React.useRef(new Animated.Value(0)).current
    const scrollXAnimated=React.useRef(new Animated.Value(0)).current

    const setActive=useCallback((activeIndex)=>{
        setIndex(activeIndex)
        scrollXIndex.setValue(activeIndex)
    },[])

    useEffect(() => {
        scrollXAnimated.addListener(({value})=>console.log(value))
        Animated.spring(scrollXAnimated,{
            toValue:scrollXIndex,
            useNativeDriver:true
        }).start()
    }, [])

    return (
        <FlingGestureHandler key="left" direction={Directions.LEFT} onHandlerStateChange={(evt)=>{
            if(evt.nativeEvent.state===State.END){
                if(index===data.length-1){
                    return
                }
                setActive(index+1)
            }
        }}>
            <FlingGestureHandler key="right" direction={Directions.RIGHT} onHandlerStateChange={(evt)=>{
            if(evt.nativeEvent.state===State.END){
                if(index===0){
                    return
                }
                setActive(index-1)
            }
        }}>
                <SafeAreaView style={styles.container}>
                    <StatusBar hidden />
                    <OverFlowItems data={data} scrollXAnimated={scrollXAnimated} />
                    <FlatList
                        data={data}
                        keyExtractor={(_,index)=>String(index)}
                        horizontal
                        inverted
                        scrollEnabled={false}
                        removeClippedSubviews={false}
                        CellRendererComponent={({item,index,children,style,...props})=>{
                            const newStyle=[style,{zIndex:data.length-index}]
                            return(
                                <View style={newStyle}>
                                    {children}
                                </View>
                            )
                        }}
                        contentContainerStyle={{
                            flex:1,
                            padding:SPACING*2,
                            justifyContent:'center'
                        }}
                        renderItem={({item,index})=>{
                            const inputRange=[index-1,index,index+1]
                            const translateX=scrollXAnimated.interpolate({
                                inputRange,
                                outputRange:[50,0,-100]
                            })
                            const scale=scrollXAnimated.interpolate({
                                inputRange,
                                outputRange:[.8,1,1.25]
                            })
                            const opacity=scrollXAnimated.interpolate({
                                inputRange,
                                outputRange:[1-1/VISIBLE_ITEMS,1,0]
                            })
                            return(
                                <Animated.View style={[styles.imageContainer,{opacity,transform:[{translateX},{scale}]}]}>
                                    <Image
                                    source={{uri:item.poster}}
                                    style={styles.poster}
                                    />
                                </Animated.View>
                            )
                        }}
                    />
                </SafeAreaView>
            </FlingGestureHandler>
        </FlingGestureHandler>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    overflowContainer:{
        height:OVERFLOW_HEIGHT,
        overflow:'hidden'
    },
    itemContainer:{
        height:OVERFLOW_HEIGHT,
        padding:SPACING
    },
    title:{
        fontSize: 28,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -1,
    },
    itemContainerRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    location:{
        fontSize:16
    },
    date:{
        fontSize:12
    },
    poster:{
        width:ITEM_WIDTH,
        height:ITEM_HEIGHT
    },
    imageContainer:{
        position:'absolute',
        left:-ITEM_WIDTH/2
    }
})