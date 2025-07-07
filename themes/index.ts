import Colors from '@/constants/Colors';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {
  adaptNavigationTheme,
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  useTheme,
} from 'react-native-paper';

const fontConfig = {
  body: {
    fontFamily: 'inter',
    fontSize: 14,
  },
  header: {
    fontFamily: 'poppins-bold',
    fontSize: 42,
  },
  headerLarge: {
    fontFamily: 'poppins-bold',
    fontSize: 24,
  },
  headerMedium: {
    fontFamily: 'poppins-bold',
    fontSize: 19,
  },
  headerSmall: {
    fontFamily: 'poppins-semibold',
    fontSize: 16,
  },
  button: {
    fontFamily: 'poppins-semibold',
    fontSize: 16,
  },
  label: {
    fontFamily: 'inter',
    fontSize: 12,
  },
  value: {
    fontFamily: 'poppins-medium',
    fontSize: 12,
  },
  title: {
    fontFamily: 'poppins-semibold',
    fontSize: 14,
  },
  subtitle: {
    fontFamily: 'poppins-medium',
    fontSize: 13,
  },
  interSemiSubTitle: {
    fontFamily: 'inter-semibold',
    fontSize: 16,
  },
  interMedSubTitle: {
    fontFamily: 'inter-medium',
    fontSize: 16,
  },
  interRegSubTitle: {
    fontFamily: 'inter',
    fontSize: 16,
  },
  interSemiHeader: {
    fontFamily: 'inter-semibold',
    fontSize: 20,
  },
  interSmallHeader: {
    fontFamily: 'inter-semibold',
    fontSize: 18,
  },

  interBoldTitleLg: {
    fontFamily: 'inter-bold',
    fontSize: 30,
  },
  interBoldTitleExtraLg: {
    fontFamily: 'inter-bold',
    fontSize: 36,
  },
  interButton: {
    fontFamily: 'inter-semibold',
    fontSize: 18,
  },
  interRegParagraph: {
    fontFamily: 'inter',
    fontSize: 13,
  },
};

type FontTheme = Omit<MD3Theme, 'fonts'> & {
  fonts: typeof fontConfig;
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: Colors.dark,
  fonts: configureFonts({ config: fontConfig }),
};
const customLightTheme = {
  ...MD3LightTheme,
  colors: Colors.light,
  fonts: configureFonts({ config: fontConfig }),
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
export const CombinedLightTheme = merge(LightTheme, customLightTheme);
export const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export type AppTheme = FontTheme & typeof CombinedLightTheme;

// Custom hook to use the extended theme
export const useAppTheme = () => useTheme<AppTheme>();
