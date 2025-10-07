import { AppTheme, useAppTheme } from '@/themes';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Icon } from 'react-native-paper'; // You can change to your icon library

interface DashedButtonProps {
  icon: string;
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconSize?: number;
}

const DashedButton: React.FC<DashedButtonProps> = ({
  icon,
  text,
  onPress,
  style,
  textStyle,
  iconSize = 20,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Icon source={icon} size={iconSize} color={theme.colors.gray2Text} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.gray3Text,
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    text: {
      color: theme.colors.gray3Text,
      ...theme.fonts.subtitle,
      marginTop: 3,
    },
  });

export default DashedButton;
