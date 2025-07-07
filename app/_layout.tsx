import InAppNotification from '@/components/InappNotification/InappNotification';
import { SessionProvider } from '@/contexts/authContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import i18n from '@/hooks/useLocalization';
import { CombinedDarkTheme, CombinedLightTheme } from '@/themes';
import InterBold from '@assets/fonts/InterBold.ttf';
import InterMedium from '@assets/fonts/InterMedium.ttf';
import InterSemiBold from '@assets/fonts/InterSemiBold.ttf';
import PoppinsBold from '@assets/fonts/Poppins-Bold.ttf';
import PoppinsMedium from '@assets/fonts/Poppins-Medium.ttf';
import PoppinsRegular from '@assets/fonts/Poppins-Regular.ttf';
import PoppinsSemiBold from '@assets/fonts/Poppins-SemiBold.ttf';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import Inter from '../assets/fonts/Inter.ttf';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'poppins-regular': PoppinsRegular,
    'poppins-bold': PoppinsBold,
    inter: Inter,
    'inter-medium': InterMedium,
    'poppins-semibold': PoppinsSemiBold,
    'inter-bold': InterBold,
    'inter-semibold': InterSemiBold,
    'poppins-medium': PoppinsMedium,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === 'light' ? CombinedLightTheme : CombinedDarkTheme;

  return (
    <GestureHandlerRootView>
      <SessionProvider>
        <NotificationProvider>
          <I18nextProvider i18n={i18n}>
            <PaperProvider theme={paperTheme}>
              <Slot initialRouteName="(public)" />
              <InAppNotification />
            </PaperProvider>
          </I18nextProvider>
        </NotificationProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
