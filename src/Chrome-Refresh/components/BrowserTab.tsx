import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { multiply, useValue, Value } from "react-native-reanimated";
import Interactable from './Interactable';
import Content from "./Content";
import Header from "./Header";

const {height}=Dimensions.get('window')

interface BrowserTabProps {}

export default function BrowserTab () {
  const x=React.useRef(new Value(0)).current;
  const y=React.useRef(new Value(0)).current;
  const snapPoints=[{ x:0 }]
  const gravityPoints=[{x: 0, y: 0, strength: 5000, falloff: height, damping: 0.5}]
  
  return (
    <View>
      <View style={styles.background} />
      <Animated.View style={{transform:[{translateX:multiply(x,-1)}]}}>
        <Interactable
          // verticalOnly={true}
          style={styles.container}
          animatedValueX={x}
          animatedValueY={y} 
          animatedNativeDriver={true}
          {...{snapPoints,gravityPoints}}
        >
          <Header {...{x,y}} />
          <Content />
        </Interactable>
      </Animated.View>
    </View>
  );
}

const styles= StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  background:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'#f0f1f2'
  }
})