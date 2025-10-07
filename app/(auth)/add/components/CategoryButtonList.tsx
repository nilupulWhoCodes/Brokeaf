import {
  categoryIcons,
  expensesCategories,
  incomeCategories,
} from '@/constants/common';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import React, { SetStateAction, useEffect, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import CategoryButton from './CategoryButton';

interface Props {
  selectedCategory: number | null;
  setSelectedCategory: React.Dispatch<SetStateAction<number>>;
  entryType: TransactionTypes | null;
  isModal?: boolean;
  error?: string;
}

const CategoryButtonList: React.FC<Props> = ({
  selectedCategory,
  setSelectedCategory,
  entryType,
  error,
  isModal = false,
}) => {
  const flatListRef = useRef<FlatList<any>>(null);

  const data =
    entryType === TransactionTypes.INCOME
      ? incomeCategories
      : expensesCategories;

  useEffect(() => {
    if (!selectedCategory || !flatListRef.current || !isModal) return;

    const index = data.findIndex((item) => item.id === selectedCategory);
    if (index !== -1 && flatListRef.current) {
      const isLastItem = index >= data.length - 1;
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: isLastItem ? 1 : 0.5,
      });
    }
  }, [selectedCategory, data, isModal]);

  const getItemLayout = (_: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  });

  return (
    <FlatList
      ref={flatListRef}
      key={`${entryType}-${isModal}`}
      scrollEnabled
      horizontal={isModal}
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      numColumns={isModal ? 1 : 3}
      contentContainerStyle={[
        styles.container,
        isModal && { flexDirection: 'row', gap: 10, paddingHorizontal: 10 },
      ]}
      columnWrapperStyle={!isModal ? styles.row : undefined}
      getItemLayout={getItemLayout}
      renderItem={({ item }) => (
        <CategoryButton
          name={item.name}
          icon={categoryIcons[item.name]}
          selected={selectedCategory === item.id}
          onPress={() => setSelectedCategory(item.id)}
          error={error}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default CategoryButtonList;
