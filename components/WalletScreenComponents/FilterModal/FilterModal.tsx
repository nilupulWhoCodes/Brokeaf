import CategoryButtonList from '@/app/(auth)/add/components/CategoryButtonList';
import { getEnumToLabel } from '@/configs/enumToLabel';
import { expensesCategories, incomeCategories } from '@/constants/common';
import { TransactionTypes } from '@/enums/TransactionsEnum';
import { AppTheme, useAppTheme } from '@/themes';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TransactionFilters = {
  type: 'all' | 'income' | 'expense';
  category?: string;
  dateRange?: { from: Date; to: Date };
};

interface FilterModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  filters: TransactionFilters;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
  setValue: React.Dispatch<React.SetStateAction<'all' | 'income' | 'expense'>>;
  value: 'all' | 'income' | 'expense';
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  setVisible,
  filters,
  setFilters,
  setValue,
  value,
}) => {
  const theme = useAppTheme();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const categories =
    value === 'income'
      ? incomeCategories
      : value === 'expense'
        ? expensesCategories
        : [];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.secondary }]}>
            Filter Transactions
          </Text>
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Transaction Type
          </Text>
          {(['all', 'income', 'expense'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setValue(t);
                setFilters((f) => ({ ...f, category: '' }));
              }}
              style={[
                styles.option,
                {
                  borderColor:
                    value?.toLowerCase() === t
                      ? theme.colors.primary
                      : theme.colors.gray5Bg,
                },
              ]}
            >
              <Text
                style={{
                  ...AppTheme.fonts.body,
                  color:
                    value?.toLowerCase() === t
                      ? theme.colors.primary
                      : theme.colors.secondary,
                }}
              >
                {getEnumToLabel(t)}
              </Text>
            </TouchableOpacity>
          ))}
          {categories.length > 0 && (
            <>
              <Text style={[styles.label, { color: theme.colors.secondary }]}>
                Category
              </Text>
              <CategoryButtonList
                selectedCategory={Number(filters?.category)}
                setSelectedCategory={(category) => {
                  console.log(category);
                  setFilters((f) => ({ ...f, category: String(category) }));
                }}
                entryType={
                  value === 'income'
                    ? TransactionTypes.INCOME
                    : value === 'expense'
                      ? TransactionTypes.EXPENSE
                      : null
                }
                isModal
              />
            </>
          )}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Date Range
          </Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              style={[styles.dateButton, { borderColor: theme.colors.gray5Bg }]}
            >
              <Text
                style={{
                  ...AppTheme.fonts.body,
                  color: filters.dateRange?.from
                    ? theme.colors.secondary
                    : theme.colors.gray5Bg,
                }}
              >
                {filters.dateRange?.from
                  ? filters.dateRange.from.toDateString()
                  : 'From'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              style={[styles.dateButton, { borderColor: theme.colors.gray5Bg }]}
            >
              <Text
                style={{
                  ...AppTheme.fonts.body,
                  color: filters.dateRange?.from
                    ? theme.colors.secondary
                    : theme.colors.gray5Bg,
                }}
              >
                {filters.dateRange?.to
                  ? filters.dateRange.to.toDateString()
                  : 'To'}
              </Text>
            </TouchableOpacity>
          </View>
          {showFromPicker && (
            <DateTimePicker
              value={filters.dateRange?.from || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_, date) => {
                setShowFromPicker(false);
                if (date) {
                  setFilters((f) => ({
                    ...f,
                    dateRange: { ...f.dateRange, from: date },
                  }));
                }
              }}
              onTouchCancel={() => setShowFromPicker(false)}
            />
          )}
          {showToPicker && (
            <DateTimePicker
              value={filters.dateRange?.to || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_, date) => {
                setShowToPicker(false);
                if (date) {
                  setFilters((f) => ({
                    ...f,
                    dateRange: { ...f.dateRange, to: date },
                  }));
                }
              }}
            />
          )}

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => setFilters({ type: 'all' })}
              style={[styles.button, { backgroundColor: theme.colors.error }]}
            >
              <Text style={{ color: theme.colors.background }}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={{ color: theme.colors.background }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: AppTheme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    ...AppTheme.fonts.interSemiHeader,
    marginBottom: 12,
  },
  label: {
    ...AppTheme.fonts.interRegParagraph,
    marginBottom: 8,
  },
  option: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  dateButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
});

export default React.memo(FilterModal);
