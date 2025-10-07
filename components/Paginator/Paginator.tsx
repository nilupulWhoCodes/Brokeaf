import { useAppTheme } from '@/themes';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { paginatorStyles } from './styles/Paginator.styles';

interface PaginatorProps {
  slides: Array<any>;
  currentSlide: number;
  activeColor: string;
  customStyles?: StyleProp<ViewStyle>;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const Paginator: React.FC<PaginatorProps> = ({
  slides,
  currentSlide,
  customStyles,
  activeColor,
  setCurrentSlide,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const theme = useAppTheme();
  const styles = paginatorStyles(theme);
  const { t } = useTranslation();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentSlide,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [currentSlide, animatedValue]);

  return (
    <View style={[styles.container, customStyles]}>
      <View style={styles.dotsContainer}>
        {slides.map((_, i: number) => {
          const width = animatedValue.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [8, 19, 8],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              onPress={() => setCurrentSlide(i)}
              key={i.toString()}
            >
              <Animated.View
                testID="paginator-dot"
                style={[
                  styles.dot,
                  { width },
                  currentSlide === i && { backgroundColor: activeColor },
                ]}
                key={i.toString()}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Paginator;
