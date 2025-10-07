import Paginator from '@/components/Paginator/Paginator';
import Selector from '@/components/Selector/Selector';
import { AppTheme } from '@/themes';
import { Transaction } from '@/types/common';
import { LinearGradient, useFont, vec } from '@shopify/react-native-skia';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { BarGroup, CartesianChart } from 'victory-native';

const IncomeChart = ({
  transactions,
  scrollViewRef,
}: {
  transactions: Transaction[];
  scrollViewRef: React.RefObject<ScrollView>;
}) => {
  const initialSlide = dayjs().month() >= 5 ? 1 : 0;
  const currentYear = dayjs().year();
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const allYears = useMemo(() => {
    if (!transactions?.length) return [currentYear];
    const years = transactions.map((t) => dayjs(t.date).year());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [transactions]);

  useEffect(() => {
    if (!allYears.includes(selectedYear)) {
      setSelectedYear(allYears[0]);
    }
  }, [allYears, selectedYear]);

  const font = useFont(require('../../../assets/fonts/InterMedium.ttf'), 12);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    transactions
      ?.filter((txn) => dayjs(txn.date).year() === selectedYear)
      .forEach((txn) => {
        const month = dayjs(txn.date).month();
        if (txn.type === 'INCOME') {
          months[month].income += txn.amount;
        } else if (txn.type === 'EXPENSE') {
          months[month].expense += txn.amount;
        }
      });

    return months;
  }, [transactions, selectedYear]);

  const dataToShow = useMemo(
    () =>
      currentSlide === 0 ? monthlyData.slice(0, 6) : monthlyData.slice(6, 12),
    [currentSlide, monthlyData]
  );

  const gesture = Gesture.Pan()
    .simultaneousWithExternalGesture(scrollViewRef) // allow vertical scroll to work
    .onEnd((event) => {
      if (event.translationX < -50) {
        runOnJS(setCurrentSlide)(1);
      } else if (event.translationX > 50) {
        runOnJS(setCurrentSlide)(0);
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 12 }}>
      {!font ? (
        <View
          style={{
            height: 300,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>Loading</Text>
        </View>
      ) : (
        <GestureDetector simultaneousHandlers={scrollViewRef} gesture={gesture}>
          <View style={{ height: 300 }}>
            <Text
              style={{ ...AppTheme.fonts.interSemiHeader, marginBottom: 10 }}
            >
              Transactions
            </Text>
            {allYears && selectedYear && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 12,
                }}
              >
                {allYears && selectedYear && (
                  <Selector
                    items={allYears.map((year) => ({
                      id: year,
                      label: String(year),
                      value: year,
                    }))}
                    selectedItem={{
                      id: selectedYear,
                      label: String(selectedYear),
                      value: selectedYear,
                    }}
                    setSelectedItem={(item) => setSelectedYear(item.value)}
                    getLabel={(item) => item.label}
                    getValue={(item) => item.value}
                    contentContainerStyle={{ marginBottom: 12 }}
                  />
                )}
              </View>
            )}

            <CartesianChart
              data={dataToShow}
              xKey="month"
              yKeys={['income', 'expense']}
              domainPadding={{ left: 30, right: 30, top: 30 }}
              axisOptions={{
                font,
                formatXLabel: (value) => {
                  const date = new Date(dayjs().year(), value - 1);
                  return date.toLocaleString('default', { month: 'short' });
                },
              }}
            >
              {({ points, chartBounds }) => (
                <BarGroup
                  chartBounds={chartBounds}
                  barWidth={20}
                  betweenGroupPadding={0.2}
                  withinGroupPadding={0.1}
                  roundedCorners={{ topLeft: 5, topRight: 5 }}
                >
                  <BarGroup.Bar
                    points={points.income}
                    animate={{ type: 'spring' }}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 275)}
                      colors={['#D2EEED', AppTheme.colors.primary]}
                    />
                  </BarGroup.Bar>
                  <BarGroup.Bar
                    points={points.expense}
                    animate={{ type: 'spring' }}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 275)}
                      colors={['#F8CAC9', AppTheme.colors.error]}
                    />
                  </BarGroup.Bar>
                </BarGroup>
              )}
            </CartesianChart>
            <Paginator
              slides={[0, 1]}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              activeColor={AppTheme.colors.primary}
              customStyles={{ marginTop: 16 }}
            />
          </View>
        </GestureDetector>
      )}
    </GestureHandlerRootView>
  );
};

export default React.memo(IncomeChart);
