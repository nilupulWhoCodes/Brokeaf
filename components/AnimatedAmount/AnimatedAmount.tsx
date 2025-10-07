import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedAmountProps {
  amount: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

const AnimatedAmount: React.FC<AnimatedAmountProps> = ({
  amount,
  duration = 3000,
  style,
}) => {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState('0.00');

  useEffect(() => {
    animatedValue.value = withTiming(amount, { duration });
  }, [amount]);

  useDerivedValue(() => {
    'worklet';
    const parts = animatedValue.value.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    runOnJS(setDisplayValue)(parts.join('.'));
  });

  return <Text style={style}>{displayValue}</Text>;
};

export default AnimatedAmount;
