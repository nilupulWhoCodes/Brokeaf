import { useCallback } from 'react';

const useFormatAmount = () => {
  const formatAmount = useCallback(
    (amount: number | string | undefined | null): string => {
      if (amount == undefined || null) {
        return 'NaN';
      }
  
      const numericValue =
        typeof amount === 'string' ? parseFloat(amount) : amount;

      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    },
    []
  );

  return { formatAmount };
};

export default useFormatAmount;
