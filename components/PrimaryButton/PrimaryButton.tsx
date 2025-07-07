import { AppTheme, useAppTheme } from '@/themes';
import React from 'react';
import {
  ButtonProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PrimaryButtonProps extends ButtonProps {
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, ...props }) => {
  const theme = useAppTheme();
  const styles = primaryButtonStyles(theme);
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainerStyles}>
      <Text style={styles.buttonNameStyles}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const primaryButtonStyles = (theme: AppTheme) =>
  StyleSheet.create({
    buttonContainerStyles: {
      minHeight: 50,
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 16,
    },
    buttonNameStyles: {
      ...theme.fonts.button,
      color: theme.colors.background,
      textAlign: 'center',
    },
  });
