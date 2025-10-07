import { StyleSheet } from 'react-native';
import { AppTheme } from '@/themes';

export const selectorStyles = (theme: AppTheme) =>
  StyleSheet.create({
    listContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
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
      ...theme.fonts.info_ContentBold,
      height: '100%',
      paddingLeft: 0,
    },
    flatListContent: { gap: 4 },
    extraChipContainer: { paddingRight: 16, paddingLeft: 8 },
    extraChip: {
      borderRadius: 6,
      height: 29,
      justifyContent: 'center',
    },
  });
