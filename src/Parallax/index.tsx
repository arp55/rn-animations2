import * as React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';


const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

interface Data{
    key:string;
    photo:string;
    avatar_url:string;
}

type Datas=Array<Data>

const images = [
  'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80',
  'https://images.unsplash.com/photo-1562569633-622303bafef5?w=800&q=80',
  'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=800&q=80',
  'https://images.unsplash.com/photo-1555096462-c1c5eb4e4d64?w=800&q=80',
  'https://images.unsplash.com/photo-1517957754642-2870518e16f8?w=800&q=80',
  'https://images.unsplash.com/photo-1546484959-f9a381d1330d?w=800&q=80',
  'https://images.unsplash.com/photo-1548761208-b7896a6ff225?w=800&q=80',
  'https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?w=800&q=80',
  'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=800&q=80',
  'https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=800&q=80',
];
const data = images.map((image, index) => ({
  key: String(index),
  photo: image,
  avatar_url: `https://randomuser.me/api/portraits/women/${Math.floor(
    Math.random() * 40
  )}.jpg`,
}));

export default function App() {
  const x=React.useRef(new Animated.Value(0)).current
  // const x=new Animated.Value(0)

  // React.useEffect(() => {
  //   x.addListener(({value})=>console.log(value))
  // }, [])

  const renderItem=({item,index}:{item:Data,index:number})=>{
    const inputRange=[width*(index-1),width*index,width*(index+1)]
    const translateX=x.interpolate({
      inputRange,
      outputRange:[width*-.7,0,width*.7]
    })
    return(
      <View style={styles.topView}>
        <View style={styles.wrapper}>
          <View style={styles.imageContainer}>
            <Animated.Image source={{uri:item.photo}} style={[styles.image,{transform:[{translateX}]}]} />
          </View>
        <Image source={{uri:item.avatar_url}} style={styles.avatar} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item:Data) => item.key}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        // snapToInterval={width}
        decelerationRate="fast"
        onScroll={Animated.event([
          {
            nativeEvent:{
              contentOffset:{ x }
            }
          }
        ],
        {useNativeDriver:true}
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView:{
    width,
    // height:ITEM_HEIGHT,
    justifyContent:'center',
    alignItems:'center',
  },
  wrapper:{
    borderWidth:5,
    borderColor:'#c4bebe',
    borderRadius:10,
    shadowColor:'#000',
    shadowOpacity:10,
    shadowRadius:10,
    shadowOffset:{
      width:0,
      height:0
    }
  },
  imageContainer:{
    width:ITEM_WIDTH,
    height:ITEM_HEIGHT,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden',
    borderRadius:10
  },
  image:{
    width:ITEM_HEIGHT*1.4,
    height:ITEM_HEIGHT,
    resizeMode:"cover",
  },
  avatar:{
    height:60,
    width:60,
    borderRadius:30,
    borderWidth:4,
    borderColor:'#fff',
    position:'absolute',
    bottom:-30,
    right:50
  }
});