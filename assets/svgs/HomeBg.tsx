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
  height = 136,
  color = 'white',
  svgStyle,
  viewBox = '0 0 414 136',
}) => {
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Path
        d="M0 0.472595H414V184.707C414 184.707 366 202.473 207 202.473C48 202.473 0 184.707 0 184.707V0.472595Z"
        fill="url(#paint0_linear_1_406)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1_406"
          x1="-10.5"
          y1="-7.5888"
          x2="60.0693"
          y2="238.064"
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
