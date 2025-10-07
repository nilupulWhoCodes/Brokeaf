import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import OTPVerification from './OTP';
import Signup from './Signup';
import Welcome from './Welcome';

const PublicLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          title: 'Welcome',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPVerification}
        options={{
          title: 'OTP',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          title: 'Signup',
          headerShown: false,
          statusBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicLayout;

const styles = StyleSheet.create({});
