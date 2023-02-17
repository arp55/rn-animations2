import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FIcon from "react-native-vector-icons/Feather";
import AIcon from "react-native-vector-icons/AntDesign";
import { RectButton } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    margin: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    padding: 16
  },
  title: {
    color: "white",
    padding: 16
  },
  cover: {
    marginVertical: 16,
    width: width - 32,
    height: width - 32
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  song: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white"
  },
  artist: {
    color: "white"
  },
  slider: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: width - 32,
    borderRadius: 2,
    height: 4,
    marginVertical: 16
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
});

interface PlayerProps {
  onPress: () => void;
}

export default ({ onPress }: PlayerProps) => {
  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={["#0b3057", "#051c30"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} {...{ onPress }}>
            <View accessible>
              <FIcon name="chevron-down" color="white" size={24} />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>The Bay</Text>
          <RectButton style={styles.button} {...{ onPress }}>
            <FIcon name="more-horizontal" color="white" size={24} />
          </RectButton>
        </View>
        <Image source={require("../assets/thebay.jpg")} style={styles.cover} />
        <View style={styles.metadata}>
          <View>
            <Text style={styles.song}>The Bay</Text>
            <Text style={styles.artist}>Metronomy</Text>
          </View>
          <AIcon name="heart" size={24} color="#55b661" />
        </View>
        <View style={styles.slider} />
        <View style={styles.controls}>
          <FIcon name="shuffle" color="rgba(255, 255, 255, 0.5)" size={24} />
          <AIcon name="stepbackward" color="white" size={32} />
          <AIcon name="play" color="white" size={48} />
          <AIcon name="stepforward" color="white" size={32} />
          <FIcon name="repeat" color="rgba(255, 255, 255, 0.5)" size={24} />
        </View>
      </View>
    </SafeAreaView>
  );
};
