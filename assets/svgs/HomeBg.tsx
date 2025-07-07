import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export interface SVGProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  svgStyle?: StyleProp<ViewStyle>;
  viewBox?: string;
}

const HomeBg: React.FC<SVGProps> = ({
  width = 414,
  height = 287,
  color = 'white',
  svgStyle,
  viewBox = '0 0 414 287',
}) => {
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Path
        d="M0 0H414V261.759C414 261.759 366 287 207 287C48 287 0 261.759 0 261.759V0Z"
        fill="url(#paint0_linear_1_406)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1_406"
          x1="-10.5"
          y1="-17.0712"
          x2="239.544"
          y2="393.953"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#429690" />
          <Stop offset="1" stopColor="#2A7C76" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default HomeBg;

const styles = StyleSheet.create({});
