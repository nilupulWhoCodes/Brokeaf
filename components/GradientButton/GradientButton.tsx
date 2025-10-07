import { AppTheme, useAppTheme } from '@/themes';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  containerStyle,
  textStyle,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.touchable}
    >
      <LinearGradient
        colors={['#69AEA9', '#3F8782']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientContainer, containerStyle]}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    gradientContainer: {
      borderRadius: 10,
      paddingHorizontal: 30,
      paddingVertical: 12,
      alignItems: 'center',
    },
    touchable: {
      width: '100%',
    },
    text: {
      color: theme.colors.background,
      ...theme.fonts.interButton,
      textAlign: 'center',
    },
  });
