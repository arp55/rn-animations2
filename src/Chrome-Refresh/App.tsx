import React from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { Asset } from "expo-asset";

import BrowserTab from "./components/BrowserTab";

interface AppProps {}
interface AppState {
  ready: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  state = {
    ready: false,
  };

  async componentDidMount() {
    await Asset.loadAsync(require("./assets/image.jpg"));
    this.setState({ ready: true });
  }

  render() {
    const { ready } = this.state;
    if (!ready) {
      return (
        <ActivityIndicator size="large" color="blue" />
      );
    }
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <BrowserTab />
      </>
    );
  }
}
