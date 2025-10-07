import { useAppTheme } from '@/themes';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Calendar, CalendarProvider } from 'react-native-calendars';

const DatePicker = ({ selectedDay, handleDayChange }) => {
  const theme = useAppTheme();
  const [weekView, setweekView] = useState<boolean>(true);
  const todayBtnTheme = useRef({
    todayButtonTextColor: theme.colors.primary,
  });
  const rotation = useRef(new Animated.Value(0));
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
  const onCalendarToggled = useCallback(
    (isOpen: boolean) => {
      rotation.current.setValue(isOpen ? 1 : 0);
    },
    [rotation]
  );

  return (
    <CalendarProvider
      date={selectedDay}
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
      // disableAutoDaySelection={[ExpandableCalendar.navigationTypes.MONTH_SCROLL, ExpandableCalendar.navigationTypes.MONTH_ARROWS]}
    >
      <Calendar
        current={selectedDay}
        onDayPress={handleDayChange}
        enableSwipeMonths={true}
        ref={calendarRef}
        onCalendarToggled={onCalendarToggled}
        markedDates={{
          [selectedDay]: {
            selected: true,
            marked: true,
            selectedColor: theme.colors.primary,
          },
        }}
        theme={{
          textSectionTitleColor: theme.colors.gray3Text,
          textDayHeaderFontSize: 12,
          textDayHeaderFontFamily: 'poppins-regular',
          textDayHeaderFontWeight: '500' as const,
          expandableKnobColor: theme.colors.primary,
          dayTextColor: theme.colors.gray1Text,
          todayTextColor: theme.colors.black,
          textDayFontSize: 12,
          textDayFontFamily: 'poppins-semibold',
          textDayFontWeight: '600' as const,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.background,
          dotColor: theme.colors.black,
          selectedDotColor: theme.colors.background,
          agendaKnobColor: theme.colors.primary,
        }}
        // horizontal={false}
        hideArrows
        animateScroll

        // disablePan
        // hideKnob
        // initialPosition={ExpandableCalendar.positions.OPEN}
        // calendarStyle={styles.calendar}
        // headerStyle={styles.header} // for horizontal only
        // disableWeekScroll
        // disableAllTouchEventsForDisabledDays

        // closeOnDayPress={false}
      />
    </CalendarProvider>
  );
};

export default DatePicker;

const styles = StyleSheet.create({});
