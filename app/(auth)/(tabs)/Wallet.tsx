import AnimatedAmount from '@/components/AnimatedAmount/AnimatedAmount';
import FilterAction from '@/components/WalletScreenComponents/FilterActionIcon/FilterActionIcon';
import FilterModal from '@/components/WalletScreenComponents/FilterModal/FilterModal';
import SegmentedButtonsComponent from '@/components/WalletScreenComponents/SegmentedButtonsComponent/SegmentedButtonsComponent';
import TransactionCard from '@/components/WalletScreenComponents/TransactionCard';
import { useSession } from '@/contexts/authContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useNotification } from '@/contexts/NotificationContext';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import useFormatAmount from '@/hooks/useFormatAmountHook';
import { transactionStore } from '@/store/TransactionStore';
import { AppTheme, useAppTheme } from '@/themes';
import { Transaction, TransactionFilters } from '@/types/common';
import NoData from '@assets/animations/No-Data.json';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useRef, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { AnimatedFAB, Appbar } from 'react-native-paper';

const Wallet = () => {
  const { transactions, totalIncome, totalExpense, totalBalance, loading } =
    transactionStore;
  const { formatAmount } = useFormatAmount();
  const { session } = useSession();
  const [filters, setFilters] = useState<TransactionFilters>({ type: 'all' });
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [value, setValue] = useState<'all' | 'income' | 'expense'>('all');
  const theme = useAppTheme();
  const styles = shoppingListStyles(theme);
  const navigation = useNavigation();
  const animation = useRef<LottieView>(null);
  const { addNotification } = useNotification();
  const { showLoader, hideLoader } = useLoader();

  const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (value !== 'all' && txn.type.toLowerCase() !== value) return false;
      if (filters.category && txn.category !== String(filters.category))
        return false;
      if (filters.dateRange) {
        const txnDate = normalizeDate(new Date(txn.date));
        const from = filters.dateRange.from
          ? normalizeDate(filters.dateRange.from)
          : null;
        const to = filters.dateRange.to
          ? normalizeDate(filters.dateRange.to)
          : null;

        if (from && txnDate < from) return false;
        if (to && txnDate > to) return false;
      }

      return true;
    });
  }, [transactions, filters, value]);

  const filteredTotals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === TransactionTypes.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = filteredTransactions
      .filter((t) => t.type === TransactionTypes.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [filteredTransactions]);

  const activeFiltersCount =
    (filters.type !== 'all' ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.dateRange ? 1 : 0);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  };

  const handleRefresh = async () => {
    try {
      showLoader();
      if (!session) return;
      await transactionStore.fetchTransactions(session);
    } catch (error) {
      addNotification("Sorry couldn't load your transactions", 'error');
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.page}>
      <StatusBar style="light" translucent hidden={false} />
      <Appbar.Header style={styles.header}>
        <Appbar.Content titleStyle={styles.headerText} title="Your Wallet" />
        <FilterAction
          activeFiltersCount={activeFiltersCount}
          onPress={() => setFilterVisible(true)}
        />
      </Appbar.Header>
      <SectionList
        style={{ marginTop: 10 }}
        sections={[{ title: 'Transactions', data: filteredTransactions }]}
        keyExtractor={(item: Transaction) => String(item.id)}
        refreshing={loading}
        onRefresh={handleRefresh}
        onScroll={onScroll}
        renderItem={({ item }: { item: Transaction }) => (
          <TransactionCard item={item} />
        )}
        renderSectionHeader={() => (
          <View style={{ backgroundColor: theme.colors.background, gap: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <AnimatedAmount
                amount={filteredTotals.totalBalance}
                duration={1000}
                style={styles.balanceAmount}
              />
            </View>
            <View style={styles.segmentedHeader}>
              <SegmentedButtonsComponent setValue={setValue} value={value} />
            </View>
            {filteredTransactions.length === 0 && (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <LottieView
                  autoPlay
                  loop={false}
                  ref={animation}
                  style={{ width: 200, height: 200 }}
                  source={NoData}
                />
              </View>
            )}
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
      />
      {filterVisible && (
        <FilterModal
          visible={filterVisible}
          setVisible={setFilterVisible}
          filters={filters}
          setFilters={setFilters}
          setValue={setValue}
          value={value}
        />
      )}
      <AnimatedFAB
        icon="plus"
        label="Add Your Transactions"
        extended={true}
        onPress={() => navigation.navigate('add')}
        visible
        animateFrom="right"
        style={styles.fabStyle}
        color={theme.colors.background}
      />
    </View>
  );
};

export default observer(Wallet);
const shoppingListStyles = (theme: AppTheme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    headerText: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    backgroundSvg: {
      width: '100%',
      position: 'absolute',
      top: 0,
      zIndex: 0,
    },
    balanceContainer: {
      flex: 1,
    },
    balanceInner: {
      marginHorizontal: 20,
      marginTop: 30,
    },
    balanceTextWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    balanceLabel: {
      color: theme.colors.secondary,
      ...theme.fonts.subtitle,
    },
    balanceAmount: {
      ...theme.fonts.interBoldTitleLg,
      color: theme.colors.black,
    },
    listWrapper: {
      flex: 1,
    },
    segmentedHeader: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    listContent: {
      paddingBottom: 20,
      flexGrow: 1,
      gap: 4,
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
