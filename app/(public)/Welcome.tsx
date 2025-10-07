import { AppTheme, useAppTheme } from '@/themes';
import Savings from '@assets/animations/Savings.json';
import { useFocusEffect, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const styles = getSignInStyles(theme);
  const [showSplashText, setShowSplashText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const dontBeAnim = useRef(new Animated.Value(0)).current;
  const brokeAFAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    lottieRef.current?.play();

    setTimeout(() => {
      setShowSplashText(true);

      Animated.timing(dontBeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(brokeAFAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();

          setShowButton(true);
        });
      });
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setProgress(0);
      if (showButton) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 1) {
              clearInterval(interval);
              navigation.navigate('Signup');
              return 1;
            }
            return prev + 0.01;
          });
        }, 20);

        return () => clearInterval(interval);
      }
    }, [showButton])
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.backgroundContainer}>
        <View style={styles.animation}>
          <LottieView
            ref={lottieRef}
            style={{ width: 400, height: 500 }}
            source={Savings}
            loop={false}
          />
        </View>

        <View style={{ flex: 1.5 }}>
          <View
            style={{
              minHeight: 120,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 30,
            }}
          >
            {showSplashText && (
              <>
                <Animated.Text
                  style={{
                    opacity: brokeAFAnim,
                    lineHeight: 42,
                    textAlign: 'center',
                    ...theme.fonts.interBoldTitleExtraLg,
                    color: theme.colors.primary,
                    transform: [{ scale: brokeAFAnim }],
                  }}
                >
                  Small steps, Big savings.
                </Animated.Text>
              </>
            )}
          </View>

          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={{
              width: '100%',
              height: 10,
              borderRadius: 5,
              marginTop: 20,
            }}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Welcome;

const getSignInStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backgroundContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    animation: {
      flex: 3,

      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {},
    title: {
      ...theme.fonts.header,
      color: theme.colors.primary,
      lineHeight: 50,
      textAlign: 'center',
    },
    footer: {
      flex: 0.5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: 10,
    },
  });
