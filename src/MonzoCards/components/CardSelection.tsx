import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated, { add, and, block, Clock, clockRunning, concat, cond, Transition,Transitioning, eq, Extrapolate, greaterOrEq, interpolate, multiply, neq, not, set, useCode, useValue, Value, TransitioningView } from "react-native-reanimated";
import { runTiming, runSpring,max } from "./AnimationHelpers";

import Card, { Card as CardModel, CARD_WIDTH, CARD_HEIGHT } from "./Card";
import CheckIcon from "./CheckIcon";
import Thumbnail from "./Thumbnail";

interface CardSelectionProps {
  cards: [CardModel, CardModel, CardModel];
}

const INITIAL_INDEX: number = -1;

const timing=(animation:Animated.Value<number>,clock:Animated.Clock)=>set(animation,runSpring(clock,animation,1))
  // set(animation,runTiming(clock,animation,{toValue:1,duration:400,easing:Easing.linear}))


export default ({ cards }: CardSelectionProps) => {
  const [selectedCardState,setSelectedCardState]=useState(INITIAL_INDEX)
  const container=useRef()
  const {animation,cardRotations,cardTranslations,cardZIndexes,clock,isGroupingAnimationDone,selectedCard,shouldUpdateIndex,translateX}=useMemo(() => ({
    selectedCard:new Value(INITIAL_INDEX),
    cardRotations:cards.map(()=>new Value(0)),
    cardTranslations:cards.map(()=>new Value(0)),
    cardZIndexes:cards.map(()=>new Value(0)),
    clock:new Clock(),
    animation:new Value(0),
    translateX:new Value(CARD_WIDTH),
    isGroupingAnimationDone:new Value(0),
    shouldUpdateIndex:new Value(1)
  }), cards)

  const transition=<Transition.Out interpolation="easeInOut" type="fade" durationMs={500} />;

  const selectCard=(index:number)=>{
    container.current.animateNextTransition()
    selectedCard.setValue(index)
    setSelectedCardState(index)
  }

  useCode(()=>
    [
    cond(eq(selectedCard,INITIAL_INDEX),[
      timing(animation,clock),
      set(cardRotations[0],interpolate(animation,{
        inputRange:[0,1],
        outputRange:[0,-15],
        extrapolate:Extrapolate.CLAMP
      })),
      set(cardRotations[2],interpolate(animation,{
        inputRange:[0,1],
        outputRange:[0,15],
        extrapolate:Extrapolate.CLAMP
      })),
      set(animation,0)
    ]),
    cond(and(neq(selectedCard,INITIAL_INDEX),not(isGroupingAnimationDone)),[
      timing(animation,clock),
      set(translateX,interpolate(animation,{
        inputRange:[0,1],
        outputRange:[translateX,0],
        extrapolate:Extrapolate.CLAMP
      })),
      set(cardRotations[0],interpolate(animation,{
        inputRange:[0,1],
        outputRange:[cardRotations[0],-15/2],
        extrapolate:Extrapolate.CLAMP
      })),
      set(cardRotations[1],interpolate(animation,{
        inputRange:[0,1],
        outputRange:[cardRotations[1],15/2],
        extrapolate:Extrapolate.CLAMP
      })),
      set(cardRotations[2],interpolate(animation,{
        inputRange:[0,1],
        outputRange:[cardRotations[2],0],
        extrapolate:Extrapolate.CLAMP
      })),
      cond(not(clockRunning(clock)),[
        set(isGroupingAnimationDone,1),
        set(animation,0)
      ])
    ]),
    ...cards.map((_,index)=>cond(
      and(eq(selectedCard,index),isGroupingAnimationDone),[
        timing(animation,clock),
        ...cards.map((_,i)=>i).filter((_,ind)=>index!==ind).map((absIndex,i)=>
          set(cardRotations[absIndex],interpolate(animation,{
            inputRange:[0,1],
            outputRange:[cardRotations[absIndex],7.5*(i%2===0?-1:1)],
            extrapolate:Extrapolate.CLAMP
          }))
        ),
        set(cardRotations[index],interpolate(animation,{
          inputRange:[0,0.5,1],
          outputRange:[0,45,0],
          extrapolate:Extrapolate.CLAMP
        })),
        set(cardTranslations[index],interpolate(animation,{
          inputRange:[0,0.5,1],
          outputRange:[0,-CARD_HEIGHT*1.5,0],
          extrapolate:Extrapolate.CLAMP
        })),
        cond(and(greaterOrEq(animation,0.5),shouldUpdateIndex),[
          set(cardZIndexes[index],add(max(...cardZIndexes),1)),
          set(shouldUpdateIndex,0)
        ]),
        cond(not(clockRunning(clock)),[
          set(shouldUpdateIndex,1),
          set(animation,0)
        ])
      ]
    )),
  ],[cards])

  return (
    <Transitioning.View ref={container} style={styles.container} transition={transition}>
      <View style={styles.cards}>
        {cards.map((card, index) => {
          const rotateZ=concat(cardRotations[index],'deg')
          return (
            <Animated.View
              key={card.id}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex:cardZIndexes[index],
                transform:[
                  {translateX:multiply(translateX,-1)},
                  {rotateZ},
                  {translateX},
                  {translateY:cardTranslations[index]}
                ]
              }}
            >
              <Card key={card.id} {...{ card }} />
            </Animated.View>
          );
        })}
      </View>
      <SafeAreaView>
        {cards.map(({ id, name, color, thumbnail }, index) => (
          <RectButton key={id} onPress={() => selectCard(index)}>
            <View style={styles.button} accessible>
              <Thumbnail {...{ thumbnail }} />
              <View style={styles.label}>
                <Text>{name}</Text>
              </View>
              {selectedCardState===index &&
              <CheckIcon {...{ color }} />}
            </View>
          </RectButton>
        ))}
      </SafeAreaView>
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cards: {
    flex: 1,
    backgroundColor: "#f4f6f3"
  },
  button: {
    flexDirection: "row"
  },
  label: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#f4f6f3",
    justifyContent: "center"
  }
});
