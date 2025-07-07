import React, { useState } from 'react';
import { Text } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { textAreaStyles } from './styles/TextArea.styles';
import { useAppTheme } from '@/themes';

interface TextAreaProps extends TextInputProps {
  errorMessage?: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value,
  required,
  editable,
  errorMessage,
  onChangeText,
}) => {
  const theme = useAppTheme();
  const styles = textAreaStyles(theme);
  const [isFocused, setIsFocused] = useState(false);
  const placeHolder =
    placeholder && required ? `${placeholder}   *` : placeholder;

  return (
    <TextInput
      editable={editable}
      placeholder={!isFocused ? placeHolder : ''}
      placeholderTextColor={theme.colors.gray3Text}
      theme={{
        colors: {
          onSurfaceVariant: theme.colors.gray3Text,
        },
      }}
      activeOutlineColor={
        errorMessage ? theme.colors.error : theme.colors.primary
      } // label color
      outlineColor={errorMessage ? theme.colors.error : theme.colors.borders}
      style={[
        styles.inputStyles,
        ,
        {
          borderColor: isFocused ? theme.colors.primary : theme.colors.borders,
        },
        {
          backgroundColor: editable
            ? theme.colors.gray7Bg
            : theme.colors.background,
        },
      ]}
      cursorColor={theme.colors.gray1Text}
      contentStyle={[styles.content]}
      label={
        required ? (
          <Text>
            {placeholder}
            {'  '}
            <Text>*</Text>
          </Text>
        ) : (
          placeholder
        )
      }
      mode="outlined"
      multiline={true}
      numberOfLines={8}
      value={value}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChangeText={onChangeText}
    />
  );
};

export default TextArea;
