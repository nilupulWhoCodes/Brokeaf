import GradientButton from '@/components/GradientButton/GradientButton';
import { useSession } from '@/contexts/authContext';
import { AppTheme, useAppTheme } from '@/themes';
import Savings from '@assets/animations/Savings.json';
import { useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const { signIn } = useSession();
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const styles = getSignInStyles(theme);
  const [showSplashText, setShowSplashText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const dontBeAnim = useRef(new Animated.Value(0)).current;
  const brokeAFAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.play();

    setTimeout(() => {
      setShowSplashText(true);

      Animated.timing(dontBeAnim, {
        toValue: 1,
        duration: 1000, // slower
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(brokeAFAnim, {
          toValue: 1,
          duration: 1200, // slower
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 800, // Adjust speed
            useNativeDriver: true,
          }).start();

          setShowButton(true);
        });
      });
    }, 2000);
  }, []);

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
                  SAVE MORE SPEND MORE
                </Animated.Text>
              </>
            )}
          </View>

          <View style={{ minHeight: 50, marginTop: 40 }}>
            {showButton && (
              <Animated.View style={{ opacity: buttonAnim }}>
                <GradientButton
                  containerStyle={{
                    borderRadius: 40,
                    height: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Get Started"
                  onPress={() => navigation.navigate('otp')}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn;

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
