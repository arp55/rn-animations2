import * as _ from "lodash";
import React from "react";
import {
  StyleSheet, View, Dimensions, Text,
} from "react-native";

import Emojis from "./components/Emojis";
import { EMOJI_WIDTH } from "./components/Model";
import Translations from "./components/Translations";
import { onScroll, lookup } from "./components/AnimationHelpers";
import AnimatedText from "./components/AnimatedText";
import Animated, { block, debug, divide, event, onChange, round, set, useCode, Value } from "react-native-reanimated";

const emojis = require("./assets/emoji-db.json");

const emojiList = Object.keys(emojis);

const { height, width } = Dimensions.get("window");
const horizontalPanHeight = EMOJI_WIDTH;
const verticalPanHeight = height / 2 - horizontalPanHeight / 2;
const numberOfEmojis = emojiList.length;
const numberOfLanguages = Object.keys(emojis[emojiList[0]]).length;

export default () => {
  const translations = {
    en: new Value(emojis[emojiList[0]].en),
    de: new Value(emojis[emojiList[0]].de),
    it: new Value(emojis[emojiList[0]].it),
    fr: new Value(emojis[emojiList[0]].fr),
    es: new Value(emojis[emojiList[0]].es),
    pt: new Value(emojis[emojiList[0]].pt),
    zhHant: new Value(emojis[emojiList[0]].zh_Hant),
    ko: new Value(emojis[emojiList[0]].ko),
    ja: new Value(emojis[emojiList[0]].ja),
  };
  
  const x=new Value(0)
  const y=new Value(0)
  const slider=new Value(0)

  const index=round(divide(x,EMOJI_WIDTH))

  return (
    <View style={styles.container}>
      <Animated.Code>
        {
          ()=>onChange(index,
            Object.keys(translations).map(lang=>set(translations[lang],lookup(emojiList.map(emoji=>emojis[emoji][lang]),index)))
          )
        }
      </Animated.Code>
      <View style={styles.container}>
        <Translations
          max={(verticalPanHeight - 150) * -1}
          {...{ emojis, translations, slider, y }}
        />
      </View>
      <Emojis {...{ emojis,x }} />
      <View style={styles.container}>
        <AnimatedText style={styles.english} text={translations.en} />
      </View>
      <Animated.ScrollView
        style={styles.verticalPan}
        contentContainerStyle={styles.verticalPanContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        snapToInterval={verticalPanHeight}
        bounces={false}
        onScroll={event(
          [{
            nativeEvent:{
              contentOffset:{ y }
            }
          }],
          { useNativeDriver: true },
        )}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.translationsContent}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          horizontal
          scrollEventThrottle={1}
          onScroll={event(
            [{
              nativeEvent:{
                contentOffset:{ x: slider }
              }
            }],
            { useNativeDriver: true },
          )}
        />
      </Animated.ScrollView>
      <Animated.ScrollView
        style={styles.horizontalPan}
        contentContainerStyle={styles.horizontalPanContent}
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEventThrottle={1}
        snapToInterval={EMOJI_WIDTH}
        decelerationRate="fast"
        onScroll={event(
          [{
            nativeEvent:{
              contentOffset:{ x }
            }
          }],
          { useNativeDriver: true },
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  english: {
    margin: 48,
    textAlign: "center",
    fontSize: 48,
    color: "black",
    fontWeight: "bold",
  },
  verticalPan:{
    ...StyleSheet.absoluteFillObject,
    height:verticalPanHeight
  },
  verticalPanContent:{
    height:verticalPanHeight*2
  },
  horizontalPan:{
    ...StyleSheet.absoluteFillObject,
    top:verticalPanHeight,
    height:horizontalPanHeight
  },
  horizontalPanContent:{
    width:numberOfEmojis*EMOJI_WIDTH
  },
  translationsContent:{
    width:(numberOfLanguages-1)*width
  }
});
