import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import OTPVerification from './otpVerification';
import SignIn from './signIn';

const PublicLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signIn"
        component={SignIn}
        options={{
          title: 'Welcome',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
      <Stack.Screen
        name="otp"
        component={OTPVerification}
        options={{
          title: 'Welcome',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicLayout;

const styles = StyleSheet.create({});
