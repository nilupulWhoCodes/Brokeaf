import { useAppTheme } from '@/themes';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
  ViewStyle,
  ViewToken,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Chip } from 'react-native-paper';
import { selectorStyles } from './styles/Selector.styles';

interface CustomItem {
  id: number;
  label: string;
  value: number;
  onPress?: () => void;
}

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
  const flatListRef = useRef<FlatList<T>>(null);
  const chipWidths = useRef(new Map<number, number>());
  const firstVisibleIndex = useRef<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [hiddenCount, setHiddenCount] = useState<number>(0);

  const totalItems = items.length;

  useEffect(() => {
    if (
      selectedItem &&
      flatListRef.current &&
      chipWidths.current.size === items.length
    ) {
      const index = items.findIndex(
        (item) => getValue(item) === getValue(selectedItem)
      );
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: index >= items.length - 2 ? -0.7 : 0,
          });
        }, 100);
      }
    }
  }, [selectedItem, items, chipWidths.current.size]);

  const handleLayout = (event: LayoutChangeEvent, id: number) => {
    const { width } = event.nativeEvent.layout;
    chipWidths.current.set(id, width);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index ?? 0;
      const hiddenItemsCount = totalItems - index - viewableItems.length;
      setHiddenCount(hiddenItemsCount > 0 ? hiddenItemsCount : 0);

      if (viewableItems.length > 0) {
        firstVisibleIndex.current = index;
        setVisibleCount(viewableItems.length);
      }
    },
    [totalItems]
  );

  const scrollToNextSet = () => {
    if (!flatListRef.current) return;
    let nextIndex = firstVisibleIndex.current + visibleCount;
    if (nextIndex >= totalItems) nextIndex = totalItems - 1;

    flatListRef.current.scrollToIndex({
      index: nextIndex,
      animated: true,
      viewPosition: 0.3,
    });
  };

  const getItemLayout = (
    data: ArrayLike<T> | null | undefined,
    index: number
  ) => {
    const widthsArray = [...chipWidths.current.values()];

    if (!data || index >= widthsArray.length) {
      return { length: 50, offset: 50 * index, index };
    }

    const length = widthsArray[index] || 50;
    const offset = widthsArray
      .slice(0, index)
      .reduce((sum, w) => sum + (w || 50), 0);

    return { length, offset, index };
  };

  const renderItem = ({ item }: { item: T }) => {
    const isSelected =
      selectedItem && getValue(selectedItem) === getValue(item);
    const id = getValue(item);

    return (
      <Pressable
        onLayout={(event) => handleLayout(event, id)}
        style={[
          styles.headerChips,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.background,
          },
        ]}
        onPress={
          'onPress' in item && item.onPress
            ? item.onPress
            : () => setSelectedItem?.(item)
        }
      >
        <Text
          style={[
            styles.transparent,
            styles.headerChipText,
            {
              color: isSelected
                ? theme.colors.background
                : theme.colors.primary,
            },
            {
              ...theme.fonts.interRegParagraph,
              fontSize: theme.fonts.interRegParagraph.fontSize,
              height: '100%',
              textAlignVertical: 'center',
              paddingLeft: 0,
            },
          ]}
        >
          {getLabel(item)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => getValue(item).toString()}
        contentContainerStyle={[contentContainerStyle, styles.flatListContent]}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={({ index }) =>
          console.log(`Failed to scroll to index ${index}`)
        }
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      {totalItems > 6 && hiddenCount > 0 && (
        <Animatable.View
          animation="fadeInRight"
          duration={500}
          delay={200}
          style={styles.extraChipContainer}
        >
          <Pressable
            onPress={scrollToNextSet}
            style={[
              {
                backgroundColor: theme.colors.backdrop,
              },
              styles.extraChip,
            ]}
          >
            <Chip
              style={styles.transparent}
              textStyle={[
                styles.headerChipText,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              +{hiddenCount}
            </Chip>
          </Pressable>
        </Animatable.View>
      )}
    </View>
  );
};

export default Selector;
