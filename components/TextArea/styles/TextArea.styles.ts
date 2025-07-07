import { StyleSheet } from 'react-native';
import { AppTheme } from '@/themes';

export const textAreaStyles = (theme: AppTheme) =>
  StyleSheet.create({
    inputStyles: {
      minHeight: 50,
      borderRadius: 4,
      flexDirection: 'row',
      ...theme.fonts.body,
    },
  });
