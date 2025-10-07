import { AppTheme, useAppTheme } from '@/themes';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  name: string;
  icon: string;
  onPress?: () => void;
  selected?: boolean;
  error?: string;
}

const CategoryButton: React.FC<Props> = ({
  name,
  icon,
  onPress,
  selected,
  error,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme, selected);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: error
            ? theme.colors.error
            : selected
              ? theme.colors.primary
              : theme.colors.gray7Bg,
        },
      ]}
      onPress={onPress}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 10 }}>
        <MaterialIcons
          name={icon}
          size={28}
          color={selected ? theme.colors.primary : theme.colors.secondary}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme, selected?: boolean) =>
  StyleSheet.create({
    button: {
      aspectRatio: 1.5,
      marginBottom: 6,
      borderRadius: 8,
      borderWidth: 1,

      backgroundColor: theme.colors.gray6Bg,
      alignItems: 'center',
      justifyContent: 'center',
      width: 110,
    },
    text: {
      textAlign: 'center',
      marginTop: 4,
      paddingHorizontal: 6,
      ...(selected ? theme.fonts.value : theme.fonts.poppinsSmall),
      color: selected ? theme.colors.primary : theme.colors.secondary,
    },
  });

export default CategoryButton;
