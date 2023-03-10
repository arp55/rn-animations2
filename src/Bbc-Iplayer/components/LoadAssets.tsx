import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { ActivityIndicator } from "react-native";

const usePromiseAll = <T extends {}>(promises: Promise<T>[], cb: () => void) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

const useLoadAssets = (assets: number[]): boolean => {
  const [ready, setReady] = useState(false);
  usePromiseAll(assets.map(asset => Asset.loadAsync(asset)), () =>
    setReady(true)
  );
  return ready;
};

interface LoadAssetsProps {
  assets: number[];
  children: React.ReactElement;
}

export default ({ assets, children }: LoadAssetsProps) => {
  const ready = useLoadAssets(assets);
  if (!ready) {
    return <ActivityIndicator size="large" color="blue" />;
  }
  return children;
};
