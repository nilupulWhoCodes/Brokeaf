import { StyleSheet } from 'react-native';
import { AppTheme } from '@/themes';

export const headerStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      shadowColor: theme.colors.info_DropShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.14,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: theme.colors.color_white,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 56,
      paddingHorizontal: 16,
    },
    iconContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconRightContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      flex: 1,
      fontFamily: 'poppins-bold',
      color: theme.colors.info_mobile_font_black,
      fontSize: 19,
      textAlign: 'center',
      alignContent: 'center',
      height: '100%',
      textAlignVertical: 'center',
    },
  });
