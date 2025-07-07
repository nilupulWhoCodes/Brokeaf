import { HomeBackground } from '@/assets/svgs';
import { useSession } from '@/contexts/authContext';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import useFormatAmount from '@/hooks/useFormatAmountHook';
import { supabase } from '@/supabase';
import { AppTheme, useAppTheme } from '@/themes';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { AnimatedFAB, SegmentedButtons } from 'react-native-paper';

// Define the type for transactions
type Transaction = {
  id: number;
  userId: string;
  type: TransactionTypes;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
};

const { width } = Dimensions.get('screen');

const originalHeight = 287;
const originalWidth = 414;
const aspectRatio = originalWidth / originalHeight;

const Wallet = () => {
  const { t } = useTranslation();
  const { session } = useSession();
  const [isExtended, setIsExtended] = useState<boolean>(true);
  const theme = useAppTheme();
  const styles = shoppingListStyles(theme);
  const [value, setValue] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { formatAmount } = useFormatAmount();

  useEffect(() => {
    fetchTransactionFromUserId();
  }, []);

  const fetchTransactionFromUserId = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', session);

      if (error) throw error;
      if (data) setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (value === 'all') return true;
    return txn.type.toLowerCase() === value;
  });

  const renderTransactionCard = ({ item }: { item: Transaction }) => (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderLeftWidth: 5,
        borderLeftColor:
          item.type == TransactionTypes.INCOME
            ? theme.colors.primary
            : theme.colors.error,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: theme.colors.elevation,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            ...theme.fonts.interMedSubTitle,
            color: theme.colors.gray1Text,
          }}
        >
          {item.category}
        </Text>
        <Text
          style={{
            ...theme.fonts.interRegParagraph,
            color: theme.colors.gray3Text,
          }}
        >
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.colors.gray1Text, marginTop: 2 }}>
          {item.description ?? 'n/a'}
        </Text>
        <Text style={{ ...theme.fonts.interButton }}>
          {formatAmount(item.amount)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <View
        style={{
          aspectRatio,
          position: 'relative',
          zIndex: 0,
        }}
      >
        <HomeBackground
          width={'100%'}
          height={'100%'}
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          svgStyle={{
            width: width,
            position: 'absolute',
            top: 0,
            zIndex: 0,
          }}
        />
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            position: 'absolute',
            backgroundColor: theme.colors.background,
            left: 0,
            right: 0,
            top: 150,
          }}
        >
          <View style={{ marginHorizontal: 20, marginTop: 30 }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30,
              }}
            >
              <Text
                style={{
                  color: theme.colors.secondary,
                  ...theme.fonts.interRegSubTitle,
                }}
              >
                Total Balance
              </Text>
              <Text
                style={{
                  ...theme.fonts.interBoldTitleLg,
                  color: theme.colors.black,
                }}
              >
                {200}
              </Text>
            </View>

            <SegmentedButtons
              style={{ backgroundColor: theme.colors.grayBg }}
              value={value}
              onValueChange={(val) => setValue(val as typeof value)}
              buttons={[
                {
                  value: 'all',
                  label: 'All',
                  style: {
                    backgroundColor:
                      value === 'all' ? theme.colors.primary : 'transparent',
                  },
                  uncheckedColor: theme.colors.secondary,
                  checkedColor: theme.colors.background,
                },
                {
                  value: 'income',
                  label: 'Income',
                  style: {
                    backgroundColor:
                      value === 'income' ? theme.colors.primary : 'transparent',
                  },
                  uncheckedColor: theme.colors.secondary,
                  checkedColor: theme.colors.background,
                },
                {
                  value: 'expense',
                  label: 'Expense',
                  style: {
                    backgroundColor:
                      value === 'expense'
                        ? theme.colors.primary
                        : 'transparent',
                  },
                  uncheckedColor: theme.colors.secondary,
                  checkedColor: theme.colors.background,
                },
              ]}
            />
          </View>

          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransactionCard}
            contentContainerStyle={{ paddingBottom: 0, marginTop: 8 }}
          />
        </View>
      </View>
      <AnimatedFAB
        icon={'plus'}
        label={'Add Your Transactions'}
        extended={isExtended}
        onPress={() => router.push('/(auth)/add/addGrocery')}
        visible={true}
        animateFrom={'right'}
        style={styles.fabStyle}
        color={theme.colors.background}
      />
    </View>
  );
};

export default Wallet;

const shoppingListStyles = (theme: AppTheme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    appBar: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    appBarTitle: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    body: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      flex: 1,
    },
    cardContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexGrow: 0,
    },
    cardHeader: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borders,
      paddingBottom: 6,
    },
    cardHeaderText: {
      color: theme.colors.primary,
      ...theme.fonts.headerSmall,
    },
    cardBody: {
      flexGrow: 1,
      paddingTop: 8,
    },
    value: {
      color: theme.colors.gray1Text,
      ...theme.fonts.value,
      textAlignVertical: 'center',
    },
    label: {
      color: theme.colors.gray3Text,
      ...theme.fonts.label,
      textAlignVertical: 'center',
    },
    cardBodyRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginVertical: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.borders,
    },
    fabStyle: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: theme.colors.primary,
      borderRadius: 28,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
    },
  });
