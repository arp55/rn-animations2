import React from "react";
import {
  ActivityIndicator,
  StyleSheet, View, Text
} from "react-native";
// import { Font } from "expo";

import { downloadImagesAsync } from "./components/Images";
import Home from "./components/Home";
import Tabbar from "./components/Tabbar";
import Intro,{Steps} from "./components/Intro";

interface AppProps {}
interface AppState {
  ready: boolean;
  steps: Steps[]|null;
}

interface Position{
  x:number;
  y:number;
  width:number;
  height:number;
}

const measure=async(ref:Text):Position=>new Promise(resolve=>ref.measureInWindow((x,y,width,height)=>resolve({
  x,y,width,height
})));

export default class App extends React.Component<AppProps, AppState> {
  home = React.createRef();

  state = {
    ready: false,
    steps:null
  };

  async componentDidMount() {
  //   await Promise.all([downloadImagesAsync(), this.downloadFontsAsync()]);
    this.setState({ ready: true });
  }

  // downloadFontsAsync = () => Font.loadAsync({
  //   "SFProDisplay-Bold": require("./assets/fonts/SF-Pro-Display-Bold.otf"),
  //   "SFProDisplay-Semibold": require("./assets/fonts/SF-Pro-Display-Semibold.otf"),
  //   "SFProDisplay-Regular": require("./assets/fonts/SF-Pro-Display-Regular.otf"),
  //   "SFProDisplay-Light": require("./assets/fonts/SF-Pro-Display-Light.otf"),
  // });

  onLoad=async()=>{
    const explore=measure(this.home.current.explore.current)
    const city=measure(this.home.current.city.current)
    const measurements=await Promise.all([explore,city])
    console.log(measurements)
    const steps = [{
      x: measurements[0].x,
      y: measurements[0].y,
      label: "Explore what the app has to offer. Choose between homes, experiences, restaurants, and more.",
    }, {
      x: measurements[1].x,
      y: measurements[1].y,
      label: "Find the best accomodation in your favorite city.",
    }];
  
    this.setState({steps})
  }

  render() {
    const { ready,steps } = this.state;
    const { onLoad } = this;
    if (!ready) {
      return (
        <ActivityIndicator size="large" color='blue' />
      );
    }
    return (
      <View style={styles.container}>
        <Home ref={this.home} {...{onLoad}} />
        <Tabbar />
        {
          steps && (
            <Intro {...{steps}} />
          )
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
