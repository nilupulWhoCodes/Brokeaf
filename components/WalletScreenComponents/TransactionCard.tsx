import { expensesCategories, incomeCategories } from '@/constants/common';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import useFormatAmount from '@/hooks/useFormatAmountHook';
import { AppTheme, useAppTheme } from '@/themes';
import { Transaction } from '@/types/common';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TransactionCardProps = {
  item: Transaction;
};

const TransactionCard = ({ item }: TransactionCardProps) => {
  const theme = useAppTheme();
  const { formatAmount } = useFormatAmount();
  const styles = getStyles(theme, item.type);
  const navigation = useNavigation();

  const handlePress = (e: GestureResponderEvent) => {
    navigation.navigate('add', item);
  };

  const getCategoryLabel = (type: TransactionTypes, categoryId: number) => {
    const categories =
      type === TransactionTypes.INCOME ? incomeCategories : expensesCategories;

    return categories.find((cat) => cat.id === categoryId)?.name ?? 'Unknown';
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card]}>
      <View style={{ flex: 0.5, justifyContent: 'center' }}>
        {item?.type === TransactionTypes.INCOME ? (
          <FontAwesome6 name="dollar" size={24} color={theme.colors.primary} />
        ) : (
          <MaterialIcons
            name="error-outline"
            size={24}
            color={theme.colors.error}
          />
        )}
      </View>
      <View style={[styles.rowSpaceBetween, { flex: 2 }]}>
        <Text
          style={[
            theme.fonts.interMedSubTitle,
            { color: theme.colors.gray1Text },
          ]}
        >
          {getCategoryLabel(item?.type, Number(item?.category))}
        </Text>
        <Text style={{ color: theme.colors.gray2Text, marginTop: 2 }}>
          {item?.description || '-'}
        </Text>
      </View>

      <View
        style={[styles.rowSpaceBetween, { flex: 1, alignItems: 'flex-end' }]}
      >
        <Text
          style={[
            theme.fonts.interRegParagraph,
            { color: theme.colors.gray3Text },
          ]}
        >
          {new Date(item?.date).toLocaleDateString()}
        </Text>
        <Text style={theme.fonts.interButton}>
          {formatAmount(item?.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionCard;

const getStyles = (theme: AppTheme, type: TransactionTypes) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderLeftColor:
        type === TransactionTypes.INCOME
          ? theme.colors.primary
          : theme.colors.error,
      borderLeftWidth: 5,
      padding: 16,
      marginHorizontal: 20,
      borderRadius: 6,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    rowSpaceBetween: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  });
