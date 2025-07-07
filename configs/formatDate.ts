import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import {
  DATE_WITH_TIME_FORMAT,
  DAY_FORMAT,
  DAY_FORMAT_UTC,
  DAY_FORMAT_W_MINUETS_HOURS,
  DAY_FORMAT_W_NAME,
  DAY_FORMATWITHDATE,
  TIME_FORMAT,
} from '@/constants/Common';

dayjs.extend(weekday);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

type FormatType =
  | 'full'
  | 'dateOnly'
  | 'timeOnly'
  | 'dateWithName'
  | 'utc'
  | 'dateAndTime';

export function formatDate(
  date: string | Date | null,
  formatType: FormatType = 'full'
): string {
  if (!date) {
    switch (formatType) {
      case 'dateOnly':
        return DAY_FORMAT;
      case 'timeOnly':
        return TIME_FORMAT;
      case 'dateWithName':
        return DAY_FORMAT_W_NAME;
      case 'utc':
        return DAY_FORMATWITHDATE;
      case 'dateAndTime':
        return DAY_FORMAT_W_MINUETS_HOURS;
      default:
        return '';
    }
  }

  if (date === '-') {
    return 'N/A';
  }

  const parsedDate = dayjs(date);

  if (formatType === 'utc') {
    return dayjs(date).utc(true).startOf('day').format(DAY_FORMAT_UTC);
  }

  switch (formatType) {
    case 'dateOnly':
      return parsedDate.format(DAY_FORMAT);
    case 'timeOnly':
      return parsedDate.format(TIME_FORMAT);
    case 'dateWithName':
      return parsedDate.format(DAY_FORMAT_W_NAME);
    case 'dateAndTime':
      return parsedDate.format(DATE_WITH_TIME_FORMAT);
    default:
      return `${parsedDate.format(DAY_FORMATWITHDATE)} ${parsedDate.format(TIME_FORMAT)}`;
  }
}
