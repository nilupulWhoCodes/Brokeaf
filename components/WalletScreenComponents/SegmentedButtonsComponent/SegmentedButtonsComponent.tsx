import { useAppTheme } from '@/themes';
import React, { SetStateAction } from 'react';
import { SegmentedButtons } from 'react-native-paper';

interface SegmentedButtonsComponentProps {
  value: 'all' | 'income' | 'expense';
  setValue: React.Dispatch<SetStateAction<'all' | 'income' | 'expense'>>;
}
const SegmentedButtonsComponent: React.FC<SegmentedButtonsComponentProps> = ({
  value,
  setValue,
}) => {
  const theme = useAppTheme();
  return (
    <SegmentedButtons
      value={value}
      style={{
        backgroundColor: theme.colors.gray6Bg,
        borderRadius: 20,
        padding: 4,
      }}
      onValueChange={(val) => setValue(val as typeof value)}
      buttons={[
        {
          value: 'all',
          label: 'ALL',
          style: {
            borderWidth: 0,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor:
              value === 'all' ? theme.colors.background : theme.colors.gray6Bg,
          },
          labelStyle:
            value === 'all'
              ? { ...theme.fonts.title }
              : { ...theme.fonts.subtitle },
          uncheckedColor: theme.colors.secondary,
          checkedColor: theme.colors.primary,
        },
        {
          value: 'income',
          label: 'INCOME',
          style: {
            borderRadius: 20,
            borderWidth: 0,
            backgroundColor:
              value === 'income'
                ? theme.colors.background
                : theme.colors.gray6Bg,
          },
          labelStyle:
            value === 'income'
              ? { ...theme.fonts.title }
              : { ...theme.fonts.subtitle },
          uncheckedColor: theme.colors.secondary,
          checkedColor: theme.colors.primary,
        },
        {
          value: 'expense',
          label: 'EXPENSE',
          style: {
            borderWidth: 0,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor:
              value === 'expense'
                ? theme.colors.background
                : theme.colors.gray6Bg,
          },
          labelStyle:
            value === 'expense'
              ? { ...theme.fonts.title }
              : { ...theme.fonts.subtitle },
          uncheckedColor: theme.colors.secondary,
          checkedColor: theme.colors.primary,
        },
      ]}
    />
  );
};

export default React.memo(SegmentedButtonsComponent);
