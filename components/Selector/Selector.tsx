import React, { useEffect } from 'react';
import { FlatList, Pressable, ViewStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import { selectorStyles } from './styles/Selector.styles';
import { useAppTheme } from '@/themes';
import { SelectorItemsProps } from '@/types/ShoppingListTypes';

type CustomItem = SelectorItemsProps | null;

interface CustomSelectorProps<T extends CustomItem> {
  items?: T[];
  selectedItem?: T;
  setSelectedItem?: React.Dispatch<React.SetStateAction<T>>;
  getLabel: (item: T) => string;
  getValue: (item: T) => number;
  contentContainerStyle?: ViewStyle;
}

const Selector = <T extends CustomItem>({
  items = [],
  selectedItem,
  setSelectedItem,
  getLabel,
  getValue,
  contentContainerStyle,
}: CustomSelectorProps<T>) => {
  const theme = useAppTheme();
  const styles = selectorStyles(theme);

  useEffect(() => {
    if (items.length > 0 && setSelectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items]);

  const renderItem = ({ item }: { item: T }) => {
    const isSelected =
      selectedItem && getValue(selectedItem) === getValue(item);

    return (
      <Pressable
        style={[
          styles.headerChips,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.primaryOpacity,
          },
        ]}
        onPress={
          'onPress' in item && item.onPress
            ? item.onPress
            : () => setSelectedItem?.(item)
        }
      >
        <Chip
          style={styles.transparent}
          textStyle={[
            styles.headerChipText,
            {
              color: isSelected
                ? theme.colors.background
                : theme.colors.primary,
            },
          ]}
        >
          {getLabel(item)}
        </Chip>
      </Pressable>
    );
  };

  return (
    <FlatList
      horizontal
      contentContainerStyle={[contentContainerStyle, { gap: 4 }]}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => getValue(item).toString()}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Selector;
