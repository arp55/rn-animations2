import * as React from "react";
import {
  SafeAreaView, View, StyleSheet, Dimensions,
} from "react-native";
import Animated, { and, color, cond, divide, eq, Extrapolate, greaterOrEq, interpolate, multiply, Value } from "react-native-reanimated";
import FIcon from "react-native-vector-icons/Feather";
import Cursor from "./Cursor";

const height = 64;
const size=32;

const {width}=Dimensions.get('window')

type HeaderProps={
  x:Value<number>;
  y:Value<number>;
}

export default class Header extends React.PureComponent<HeaderProps> {
  index=new Value(1)
  render() {
    const {x,y}=this.props
    const {index}=this
    const segment=(width-(size*3))/4
    const translateY=divide(y,-2)

    const black=color(0,0,0)
    const white=color(255,255,255)

    const opacity=interpolate(y,{
      inputRange:[height,height*2],
      outputRange:[0,1],
      extrapolate:Extrapolate.CLAMP
    })
    const opacityCenter=interpolate(y,{
      inputRange:[0,height],
      outputRange:[0,1],
      extrapolate:Extrapolate.CLAMP
    })
    const translateIcon=interpolate(y,{
      inputRange:[height,height*2],
      outputRange:[segment,0],
      extrapolate:Extrapolate.CLAMP
    })

    // const color = interpolate(index,{
    //   inputRange: [0, 1, 2],
    //   outputRange: ['#858a91', '#ffffff']
    // });

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={{
          flex:1,
          ...StyleSheet.absoluteFillObject,
          transform:[{translateY}],
          opacity,
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <Cursor {...{size,x,index,segment}} />
        </Animated.View>
        <Animated.View style={[styles.content,{transform:[{translateY}]}]}>
          <Animated.View style={{opacity,transform:[{translateX:translateIcon}]}}>
            {/* <Animated.Text style={{color:cond(eq(index,0),white,black)}}> */}
            <Animated.Text>
              <FIcon name="plus" {...{size}} />
            </Animated.Text>
          </Animated.View>
          <Animated.View style={{opacity:opacityCenter}}>
            {/* <Animated.Text style={{color:cond(and(eq(index,0),greaterOrEq(y,height)),white,black)}}> */}
            <Animated.Text>
              <FIcon name="refresh-ccw" {...{size}} />
            </Animated.Text>
          </Animated.View>
          <Animated.View style={{opacity,transform:[{translateX:multiply(translateIcon,-1)}]}}>
            {/* <Animated.Text style={{color:cond(eq(index,0),white,black)}}> */}
            <Animated.Text>
              <FIcon name="x" {...{size}} />
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f1f2",
  },
  content: {
    height,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
