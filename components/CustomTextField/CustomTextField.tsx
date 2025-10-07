import { AppTheme, useAppTheme } from '@/themes';
import React, { ReactElement } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface CustomTextFieldProps extends TextInputProps {
  label: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
  multiline?: boolean;
  required?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  iconColor = '#666',
  iconSize = 20,
  ...rest
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {rest?.required && (
          <Text style={{ color: theme.colors.error }}>{'  '}*</Text>
        )}
      </Text>
      <View style={styles.inputWrapper}>
        <View style={{ width: '5%' }}>{leftIcon && leftIcon}</View>
        <TextInput
          editable={rest.editable}
          multiline={rest.multiline}
          numberOfLines={rest.numberOfLines}
          style={[
            styles.input,
            inputStyle,
            {
              minHeight: !rest.multiline ? 48 : undefined,
              textAlignVertical: rest.multiline ? 'top' : 'center',
            },
          ]}
          placeholderTextColor={theme.colors.gray3Text}
          {...rest}
        />
        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
      </View>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      marginBottom: 8,
      ...theme.fonts.value,
      color: theme.colors.gray3Text,
    },
    inputWrapper: {
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.colors.gray5Bg,
      borderRadius: 8,
      // justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingLeft: 12,
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      height: 50,
      width: 50,
    },
    input: {
      flex: 1,
      paddingHorizontal: 10,
      ...theme.fonts.body,
      color: theme.colors.secondary,
      width: '100%',
    },
    leftIcon: {
      position: 'absolute',
      left: 10,
      top: 14,
    },
    rightIcon: {
      position: 'absolute',
      right: 10,
      top: 14,
    },
  });

export default CustomTextField;
