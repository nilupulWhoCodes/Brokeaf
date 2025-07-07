import { StyleSheet } from 'react-native';
import { AppTheme } from '@/themes';

export const inAppNotificationStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      zIndex: 1000,
    },
    notification: {
      flexDirection: 'row',
      padding: 17,
      borderRadius: 15,
      marginVertical: 5,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'space-between',
    },
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      gap: 17,
      alignItems: 'center',
    },
    text: {
      flex: 1,
      flexWrap: 'wrap',
      color: theme.colors.error,
      ...theme.fonts.info_Pop_Subtitle1,
      height: '100%',
      textAlignVertical: 'center',
    },
    closeIconContainer: {
      borderWidth: 1.5,
      padding: 7,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.colors.gray3Text,
    },
  });
