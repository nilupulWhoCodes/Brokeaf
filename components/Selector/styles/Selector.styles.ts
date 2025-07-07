import { AppTheme } from '@/themes';
import { StyleSheet } from 'react-native';

export const selectorStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerChips: {
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 6,
      justifyContent: 'center',
      height: 29,
    },
    transparent: {
      backgroundColor: 'transparent',
    },
    headerChipText: {
      fontFamily: 'poppins-bold',
      fontSize: 12,
      height: '100%',
      paddingLeft: 0,
    },
  });
