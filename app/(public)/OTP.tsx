import BackButton from '@/components/BackButton/BackButton';
import { useSession } from '@/contexts/authContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import NotificationAnimation from '@assets/animations/Sent Mail.json';
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';

const OTPVerification = () => {
  const theme = useAppTheme();
  const route = useRoute();
  const email = route.params?.email;
  const styles = getStyles(theme);
  const nav = useNavigation();
  const { showLoader, hideLoader } = useLoader();
  const { signIn } = useSession();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[] | null>([]);
  const [error, setError] = useState<boolean>(false);
  const animation = useRef<LottieView>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const resendInterval = useRef<NodeJS.Timer | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    startResendCountdown();
  }, []);

  useEffect(() => {
    if (resendTimer === 0 && resendInterval.current) {
      clearInterval(resendInterval.current);
      resendInterval.current = null;
    }
  }, [resendTimer]);

  const startResendCountdown = () => {
    setResendTimer(60);
    resendInterval.current = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
  };

  const handleResend = async () => {
    try {
      showLoader();
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) {
        addNotification(error?.message ?? `Failed to send OTP.`, 'error');
        console.error(error);
        return;
      }
      addNotification('OTP has been resent!', 'success');
      startResendCountdown();
    } catch (err) {
      console.error(err);
      addNotification(error?.message ?? `Failed to send OTP.`, 'error');
    } finally {
      hideLoader();
    }
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError(false);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
    if (index === otp.length - 1 && text) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        inputs.current[index]?.focus();
        setActiveIndex(index);
      }
    }
  };

  const verifyOTP = async (code: string) => {
    try {
      if (!code || code.length < 6) return;
      showLoader();
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email',
      });

      if (error) {
        addNotification(error?.message ?? `Failed to verify the OTP.`, 'error');
        console.error('OTP verification failed:', error);
        setError(true);
        setOtp(Array(6).fill(''));
        inputs.current[0]?.focus();
        setActiveIndex(0);
        return;
      }

      const user = data.user;
      if (!user) {
        Alert.alert('Error', 'No user returned after verification.');
        return;
      }

      const userId = user.id;

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking user:', fetchError);
        addNotification(fetchError.message || 'Sorry! Login Failed', 'error');
        return;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: userId,
            email: email,
            isNewUser: true,
          },
        ]);

        if (insertError) {
          console.error('Error creating user:', insertError);
          Alert.alert('Error', 'Failed to create user record.');
          return;
        }
        console.log('New user created in DB');
      } else {
        console.log('User already exists in DB:', existingUser);
      }
      signIn(userId);
      router.replace('/');
      addNotification('Login Successfull', 'success');
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} hidden={true} />
      <View>
        <BackButton
          iconColor={theme.colors.black}
          handleBackPress={() => nav.goBack()}
        />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View>
          <LottieView
            autoPlay
            loop={false}
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            source={NotificationAnimation}
          />
        </View>
        <Text style={styles.title}>Verification Code</Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          Please check your inbox {email} and enter the code we sent you
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                styles.otpInput,
                activeIndex === index && styles.activeInput,
                error && styles.errorInput,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
              caretHidden={true}
              onFocus={() => setActiveIndex(index)}
              showSoftInputOnFocus={true}
              blurOnSubmit={false}
            />
          ))}
        </View>
        {error && (
          <Text style={styles.errorMessage}>
            Sorry couldn't verify your OTP. Please try again
          </Text>
        )}
        <TouchableOpacity
          disabled={resendTimer > 0}
          onPress={handleResend}
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor:
              resendTimer > 0 ? theme.colors.gray5Bg : theme.colors.primary,
          }}
        >
          <Text style={{ color: theme.colors.background, textAlign: 'center' }}>
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPVerification;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      paddingBottom: 20,
      paddingTop: 30,
    },
    title: {
      ...theme.fonts.interSemiHeader,
    },
    subtitle: {
      ...theme.fonts.body,
      textAlign: 'center',
      marginTop: 5,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 20,
    },
    otpInput: {
      width: 45,
      height: 55,
      borderWidth: 1,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 18,
      borderColor: '#ccc',
    },

    activeInput: {
      borderColor: theme.colors.tertiary,
    },
    errorInput: {
      borderColor: theme.colors.error,
    },
    errorMessage: {
      marginTop: 10,
      color: theme.colors.error,
      ...theme.fonts.interRegParagraph,
    },
  });
