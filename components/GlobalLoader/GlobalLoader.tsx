import { AppTheme } from '@/themes';
import Loading from '@assets/animations/Loader.json';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const GlobalLoader = () => {
  const animation = useRef<LottieView>(null);
  return (
    <View style={styles.overlay}>
      <LottieView
        autoPlay
        loop
        ref={animation}
        style={styles.loader}
        source={Loading}
      />
    </View>
  );
};

export default GlobalLoader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backdrop,
    zIndex: 999,
  },
  loader: {
    width: 200,
    height: 200,
  },
});
