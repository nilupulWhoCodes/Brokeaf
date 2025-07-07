import { AppTheme, useAppTheme } from '@/themes';
import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18next';
import React, {
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useState,
} from 'react';
import { Text, TextInputProps, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { autoCompleteDropdownStyles } from './styles/AutoCompleteDropdown.styles';

interface AutoCompleteDropdownProps<T> extends TextInputProps {
  dataSet: T[];
  valueField: string;
  labelField: string;
  selectedValue: number | string | null;
  onSelect: (id?: number | string) => void;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  dropdown?: boolean;
  search?: boolean;
  containerStyles?: ViewStyle;
  required?: boolean;
  storeLabelInstead?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  renderRightIcon?: ReactElement;
  borderColor?: keyof AppTheme['colors'] | (string & {}) | null;
  backgroundColor?: keyof AppTheme['colors'] | (string & {}) | null;
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null;
}

export interface AutoCompleteDropdownHandle {
  openDropdown: () => void;
}

const AutoCompleteDropdownInner = <T extends Record<string, any>>(
  {
    placeholder,
    dataSet,
    labelField,
    valueField,
    selectedValue,
    onSelect,
    dropdownPosition,
    dropdown,
    search,
    containerStyles,
    required,
    storeLabelInstead,
    disabled,
    errorMessage,
    backgroundColor,
    borderColor,
    renderInputSearch,
    ...props
  }: AutoCompleteDropdownProps<T>,
  ref: React.Ref<AutoCompleteDropdownHandle>
) => {
  const theme = useAppTheme();
  const styles = autoCompleteDropdownStyles(theme);
  const [isFocus, setIsFocus] = useState(false);
  const dropdownRef = React.useRef<any>(null);

  useImperativeHandle(ref, () => ({
    openDropdown: () => dropdownRef.current.open(),
    closeDropdown: () => dropdownRef.current?.close?.(),
  }));

  const renderLabel = () => {
    if (selectedValue || isFocus) {
      return (
        <View style={styles.labelContainer}>
          <View
            style={[
              styles.labelBackground,

              {
                backgroundColor: disabled
                  ? theme.colors.background
                  : theme.colors.background,
              },
              {
                height: disabled ? '20%' : '50%',
              },
            ]}
          />
          <Text
            style={[
              styles.label,
              {
                color: disabled
                  ? theme.colors.gray3Text
                  : theme.colors.gray3Text,
              },
            ]}
          >
            {placeholder + (required ? ' *' : '')}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[containerStyles]}>
      {renderLabel()}
      <Dropdown
        ref={dropdownRef}
        renderInputSearch={renderInputSearch}
        confirmSelectItem
        disable={disabled}
        style={[
          {
            backgroundColor: backgroundColor
              ? backgroundColor
              : disabled
                ? theme.colors.gray7Bg
                : theme.colors.background,
          },
          styles.dropdown,
          isFocus && {
            borderColor: borderColor ? borderColor : theme.colors.primary,
          },
          {
            borderColor: borderColor
              ? borderColor
              : disabled
                ? theme.colors.gray7Bg
                : errorMessage
                  ? theme.colors.error
                  : theme.colors.grayBg,
          },
          {
            backgroundColor: disabled
              ? theme.colors.gray7Bg
              : theme.colors.background,
          },
        ]}
        renderRightIcon={() =>
          props.renderRightIcon
            ? props.renderRightIcon
            : !disabled && (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={20}
                  color={theme.colors.gray3Text}
                />
              )
        }
        iconColor={disabled ? theme.colors.gray3Text : theme.colors.gray3Text}
        keyboardAvoiding
        dropdownPosition={dropdownPosition ?? 'auto'}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: theme.colors.gray3Text },
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          {
            color: disabled ? theme.colors.gray3Text : theme.colors.gray1Text,
          },
        ]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={dropdown ? styles.iconStyle : styles.iconDisplayNone}
        data={dataSet ?? []}
        itemTextStyle={styles.item}
        search={search}
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        placeholder={
          !isFocus
            ? placeholder + (required ? ' *' : '')
            : dataSet.length <= 0
              ? t('no_data_to_select')
              : '...'
        }
        searchPlaceholder={t('search')}
        value={
          storeLabelInstead
            ? dataSet.find((item) => item[labelField] === selectedValue)?.[
                valueField
              ]
            : selectedValue
        }
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          const selectedValue = storeLabelInstead
            ? item[labelField]
            : item[valueField];
          onSelect(selectedValue as number);
          setIsFocus(false);
        }}
      />
      {errorMessage && (
        <Text style={[errorMessage && { marginTop: 5 }, styles.errorMessage]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const AutoCompleteDropdown = forwardRef(AutoCompleteDropdownInner) as <T>(
  props: AutoCompleteDropdownProps<T> & {
    ref?: React.Ref<AutoCompleteDropdownHandle>;
  }
) => ReactElement;

export default AutoCompleteDropdown;
