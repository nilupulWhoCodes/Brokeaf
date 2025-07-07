import { AppTheme, useAppTheme } from '@/themes';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { ReactNode, RefObject, useState } from 'react';
import {
  TextInput as RNTextInput,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { textFieldStyles } from './styles/TextField.styles';

type ThemeColorKey = keyof AppTheme['colors'];
interface TextFieldProps extends TextInputProps {
  required?: boolean;
  inputRef?: RefObject<RNTextInput>;
  errorMessage?: string;
  placeHolderColor?: ThemeColorKey;
  outlineBorderColor?: ThemeColorKey;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  rightIcon?: keyof typeof AntDesign.glyphMap | ReactNode;
  inputStyles?: TextStyle;
  customContentStyles?: TextStyle;
  rightIconWidthStyle?: ViewStyle;
  borderColor?: ThemeColorKey | (string & {}) | null;
}
const TextField: React.FC<TextFieldProps> = ({
  required,
  inputRef,
  leftIcon,
  rightIcon,
  inputStyles,
  customContentStyles,
  borderColor,
  errorMessage,
  placeHolderColor,
  outlineBorderColor,
  ...props
}) => {
  const theme = useAppTheme();
  const disabledBgColor = theme.colors.gray7Bg;
  const disabledColor = theme.colors.gray3Text;
  const [isFocused, setIsFocused] = useState(false);
  const styles = textFieldStyles(theme, isFocused);
  const placeHolder =
    props.placeholder && required
      ? `${props.placeholder}   *`
      : props.placeholder;

  return (
    <View>
      <TextInput
        placeholder={!isFocused ? placeHolder : ''}
        placeholderTextColor={theme.colors.gray3Text}
        ref={inputRef}
        disabled={props.disabled}
        theme={{
          colors: {
            onSurfaceVariant: placeHolderColor || theme.colors.gray3Text,
          },
        }}
        keyboardType={props.keyboardType}
        activeOutlineColor={
          outlineBorderColor ? outlineBorderColor : theme.colors.primary
        }
        cursorColor={theme.colors.gray1Text}
        mode={props.mode ?? 'outlined'}
        outlineColor={
          errorMessage
            ? theme.colors.error
            : borderColor || theme.colors.borders
        }
        textColor={props.disabled ? disabledColor : theme.colors.gray1Text}
        left={
          leftIcon && (
            <TextInput.Icon
              color={props.disabled ? theme.colors.gray1Text : disabledColor}
              size={20}
              icon={(props) => (
                <MaterialCommunityIcons name={leftIcon} {...props} />
              )}
            />
          )
        }
        right={
          rightIcon && (
            <TextInput.Icon
              style={
                typeof rightIcon != 'string'
                  ? {
                      height: '100%',
                      width: 150,
                    }
                  : {}
              }
              size={20}
              color={props.disabled ? disabledColor : theme.colors.gray1Text}
              icon={(props) =>
                typeof rightIcon === 'string' ? (
                  <AntDesign
                    name={rightIcon as keyof typeof AntDesign.glyphMap}
                    {...props}
                  />
                ) : (
                  rightIcon
                )
              }
            />
          )
        }
        editable={!props.disabled && props.editable}
        contentStyle={[
          customContentStyles && customContentStyles,
          styles.contentStyle,
          rightIcon ? { width: '70%' } : {},
        ]}
        style={[
          { minHeight: 50 },
          styles.textStyles,
          inputStyles,
          {
            backgroundColor: props.disabled
              ? disabledBgColor
              : theme.colors.background,
          },
        ]}
        value={props.value}
        label={
          <Text>
            {props.placeholder}
            {required && (
              <Text style={{ color: theme.colors.error }}>{'     *'}</Text>
            )}
          </Text>
        }
        onChangeText={props.onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={props.multiline}
        pointerEvents={props.disabled ? 'none' : 'auto'}
      />
      {errorMessage && (
        <Text style={[errorMessage && { marginTop: 5 }, styles.errorMessage]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default TextField;
