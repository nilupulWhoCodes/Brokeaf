import { AppTheme, useAppTheme } from '@/themes';
import Loading from '@assets/animations/Loader.json';
import LottieView from 'lottie-react-native';
import React, { createContext, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const animation = useRef<LottieView>(null);
  const styles = getStyles(theme);
  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {visible && (
        <View style={styles.overlay}>
          <LottieView
            autoPlay
            loop
            ref={animation}
            style={styles.loader}
            source={Loading}
          />
        </View>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backdrop,
      zIndex: 999,
    },
    loader: {
      width: 200,
      height: 200,
    },
  });
