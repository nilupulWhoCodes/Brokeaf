import GradientButton from '@/components/GradientButton/GradientButton';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import Pig from '@assets/animations/Pig.json';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function Signup({ navigation }: any) {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = React.useState(false);
  const { showLoader, hideLoader } = useLoader();
  const animation = useRef<LottieView>(null);
  const { addNotification } = useNotification();
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const sendOTP = async () => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
        setEmailError('Please enter a valid email');
        return;
      }
      setEmailError('');
      showLoader();

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
      });

      if (error) {
        console.error(error);
        throw new Error(error?.message ?? 'Failed to send OTP');
      } else {
        navigation.navigate('OTP', { email: trimmedEmail });
        addNotification(`OTP sent to ${trimmedEmail}`, 'success');
      }
    } catch (error: any) {
      addNotification(error?.message ?? 'Failed to send OTP.', 'error');
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} hidden={false} />
      <View style={{ flex: 3 }}>
        <View style={{ alignItems: 'center' }}>
          <LottieView
            autoPlay
            loop
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            source={Pig}
          />
        </View>
        <Text style={styles.title}>Start Tracking Smarter</Text>
        <Text style={styles.subtitle}>
          Sign up with your email and take control of your money.
        </Text>
        <View style={styles.phoneContainer}>
          <TextInput
            placeholderTextColor={theme.colors.gray5Bg}
            style={styles.input}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text: string) => {
              setEmailError('');
              setEmail(text);
            }}
            autoFocus={true}
          />
          {emailError && <Text style={styles.errorMessage}>{emailError} </Text>}
        </View>
      </View>
      <GradientButton onPress={sendOTP} title={'Get OTP'} />
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    title: {
      ...theme.fonts.interSemiHeader,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.fonts.body,
      marginHorizontal: 50,
      marginTop: 4,
      textAlign: 'center',
    },
    phoneContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      marginTop: 20,
      borderColor: theme.colors.border,
      borderRadius: 8,
    },
    callingCode: {
      fontSize: 18,
      marginLeft: 5,
      marginRight: 10,
    },
    input: {
      flex: 1,
      minHeight: 50,
      paddingHorizontal: 16,
      ...theme.fonts.body,
    },
    errorMessage: {
      marginTop: 6,
      color: theme.colors.error,
      ...theme.fonts.interRegParagraph,
    },
  });
