import React, { useState, useEffect } from "react";
import { ActivityIndicator, StatusBar, Image, View, Text, StyleSheet } from "react-native";

import Album from "./components/Album";
import { Album as AlbumModel } from "./components/Model";

const album: AlbumModel = {
  name: "Remote Control",
  artist: "Jan Blomqvist",
  release: 2016,
  // eslint-disable-next-line global-require
  cover: require("./assets/Jan-Blomqvist.jpg"),
  tracks: [
    { name: "Stories Over" },
    { name: "More", artist: "Jan Blomqvist, Elena Pitoulis" },
    { name: "Empty Floor" },
    { name: "Her Great Escape" },
    { name: "Dark Noise" },
    { name: "Drift", artist: "Jan Blomqvist, Aparde" },
    { name: "Same Mistake" },
    { name: "Dancing People Are Never Wrong", artist: "Jan Blomqvist, The Bianca Story" },
    { name: "Back in the Taxi" },
    { name: "Ghosttrack" },
    { name: "Just OK" },
    { name: "The End" },
    { name: "Empty Floor" },
    { name: "Her Great Escape" },
    { name: "Dark Noise" },
    { name: "Drift", artist: "Jan Blomqvist, Aparde" },
    { name: "Same Mistake" },
  ],
};

export default () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      // await Asset.loadAsync(album.cover);
      Image.prefetch(String(album.cover))
      setReady(true)
    })();
  });
  if (!ready) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Album {...{ album }} />
    </>
  );
};
