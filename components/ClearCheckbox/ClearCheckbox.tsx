import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/themes';

type ClearCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  color?: string;
  size?: number;
};

const ClearCheckbox: React.FC<ClearCheckboxProps> = ({
  checked,
  onToggle,
  color = '#007AFF',
  size = 24,
}) => {
  const theme = useAppTheme();

  return (
    <Pressable onPress={onToggle} style={styles.wrapper}>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? theme.colors.primary : theme.colors.primary,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
          },
        ]}
      >
        {checked && (
          <MaterialCommunityIcons
            name="check-all"
            size={size * 0.6}
            color="white"
          />
        )}
      </View>
    </Pressable>
  );
};

export default ClearCheckbox;

const styles = StyleSheet.create({
  wrapper: {
    // padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
