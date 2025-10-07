import InAppNotification from '@/components/InappNotification/InappNotification';
import { SessionProvider } from '@/contexts/authContext';
import { LoaderProvider } from '@/contexts/LoaderContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TabBarVisibilityProvider } from '@/contexts/TabBarContext';
import { CombinedLightTheme } from '@/themes';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import Inter from '../assets/fonts/Inter.ttf';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

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
  const paperTheme = CombinedLightTheme;
  return (
    <GestureHandlerRootView>
      <LoaderProvider>
        <TabBarVisibilityProvider>
          <SessionProvider>
            <NotificationProvider>
              <PaperProvider theme={paperTheme}>
                <Slot initialRouteName="(public)" />
                <InAppNotification />
              </PaperProvider>
            </NotificationProvider>
          </SessionProvider>
        </TabBarVisibilityProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}
