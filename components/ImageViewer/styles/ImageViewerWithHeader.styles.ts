import { AppTheme } from '@/themes';
import { StyleSheet } from 'react-native';

export const imageViewerWithHeaderStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 56,
      marginHorizontal: 16,
      backgroundColor: theme.colors.backdrop,
    },

    closeButton: {
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
