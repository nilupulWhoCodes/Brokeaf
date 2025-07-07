import { AppTheme, useAppTheme } from '@/themes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SecondaryButtonProps {
  buttonName: string;
  onPress: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  buttonName,
  onPress,
}) => {
  const theme = useAppTheme();
  const styles = secondaryButtonStyles(theme);
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainerStyles}>
      <Text style={styles.buttonNameStyles}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const secondaryButtonStyles = (theme: AppTheme) =>
  StyleSheet.create({
    buttonContainerStyles: {
      minHeight: 50,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 5,
    },
    buttonNameStyles: {
      ...theme.fonts.button,
      color: theme.colors.primary,
      textAlign: 'center',
    },
  });
