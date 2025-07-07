import { AppTheme } from '@/themes';
import { StyleSheet } from 'react-native';

export const autoCompleteDropdownStyles = (theme: AppTheme) =>
  StyleSheet.create({
    dropdown: {
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 16,
    },
    labelContainer: {
      position: 'absolute',
      left: 9,
      top: -9,
      paddingHorizontal: 8,
      zIndex: 999,
      flexDirection: 'row',
      alignItems: 'center',
    },
    item: { ...theme.fonts.label },
    label: {
      ...theme.fonts.label,
      zIndex: 1,
    },
    labelBackground: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      zIndex: 0,
    },
    placeholderStyle: {
      ...theme.fonts.label,
    },
    selectedTextStyle: {
      ...theme.fonts.body,
    },
    iconDisplayNone: {
      display: 'none',
    },
    iconStyle: {
      width: 24,
      height: 24,
    },
    inputSearchStyle: {
      height: 50,
      fontSize: 14,
    },
    errorMessage: {
      color: theme.colors.error,
      ...theme.fonts.info_subModule,
    },
  });
