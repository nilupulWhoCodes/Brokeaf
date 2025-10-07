import GlobalLoader from '@/components/GlobalLoader/GlobalLoader';
import { useSession } from '@/contexts/authContext';
import { AppTheme } from '@/themes';
import { Redirect, Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const animation = useRef<LottieView>(null);

  if (isLoading) {
    return <GlobalLoader />;
  }
  if (!session) {
    return <Redirect href="/Welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

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
