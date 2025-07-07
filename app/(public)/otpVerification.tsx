import GradientButton from '@/components/GradientButton/GradientButton';
import TextField from '@/components/TextField/TextField';
import { useSession } from '@/contexts/authContext';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const OTPVerification = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  const { signIn } = useSession();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneNumberError(
        'Please enter a valid phone number with country code'
      );
      return;
    }

    setPhoneNumberError('');
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send OTP.');
    } else {
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone.');
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otpCode,
      type: 'sms',
    });

    if (error) {
      console.error('OTP verification failed:', error);
      Alert.alert('Invalid OTP', 'Verification failed.');
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
      Alert.alert('Error', 'Failed to check user status.');
      return;
    }

    // Step 2: If not found, insert user
    if (!existingUser) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: userId,
          phone: phoneNumber,
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

    Alert.alert('Success', 'Phone authentication successful!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>Please Enter Your Phone Number</Text>

          <TextField
            errorMessage={phoneNumberError}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={'+1234567890'}
            keyboardType="phone-pad"
          />

          {otpSent && (
            <TextField
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="Enter OTP"
              keyboardType="number-pad"
            />
          )}
        </View>

        <GradientButton
          title={otpSent ? 'Verify OTP' : 'Get OTP'}
          onPress={otpSent ? verifyOTP : sendOTP}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      marginBottom: 20,
    },
    title: {
      ...theme.fonts.interBoldTitleExtraLg,
    },
    subtitle: {
      ...theme.fonts.body,
    },
  });
