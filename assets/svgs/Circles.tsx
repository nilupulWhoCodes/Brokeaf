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

const Circles: React.FC<SVGProps> = ({
  width = 267,
  height = 104,
  color = 'white',
  svgStyle,
  viewBox = '0 0 414 136',
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      style={svgStyle}
    >
      <Path
        opacity="0.1"
        d="M0 53.2869C0 81.0153 47.4578 103.494 106 103.494C164.542 103.494 212 81.0153 212 53.2869C212 25.5585 164.542 3.08014 106 3.08014C47.4578 3.08014 0 25.5585 0 53.2869ZM190.8 53.2869C190.8 75.4696 152.834 93.4523 106 93.4523C59.1663 93.4523 21.2 75.4696 21.2 53.2869C21.2 31.1042 59.1663 13.1215 106 13.1215C152.834 13.1215 190.8 31.1042 190.8 53.2869Z"
        fill="url(#paint0_linear_647_1490)"
      />
      <Path
        opacity="0.1"
        d="M114 33.2658C114 49.9369 142.43 63.4514 177.5 63.4514C212.57 63.4514 241 49.9369 241 33.2658C241 16.5947 212.57 3.08014 177.5 3.08014C142.43 3.08014 114 16.5947 114 33.2658ZM228.3 33.2658C228.3 46.6027 205.556 57.4143 177.5 57.4143C149.444 57.4143 126.7 46.6027 126.7 33.2658C126.7 19.9289 149.444 9.11727 177.5 9.11727C205.556 9.11727 228.3 19.9289 228.3 33.2658Z"
        fill="url(#paint1_linear_647_1490)"
      />
      <Path
        opacity="0.1"
        d="M267 20.0211C267 31.0784 247.972 40.0422 224.5 40.0422C201.028 40.0422 182 31.0784 182 20.0211C182 8.96375 201.028 0 224.5 0C247.972 0 267 8.96375 267 20.0211ZM190.5 20.0211C190.5 28.867 205.722 36.038 224.5 36.038C243.278 36.038 258.5 28.867 258.5 20.0211C258.5 11.1752 243.278 4.00422 224.5 4.00422C205.722 4.00422 190.5 11.1752 190.5 20.0211Z"
        fill="url(#paint2_linear_647_1490)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_647_1490"
          x1="185.5"
          y1="4.22119"
          x2="102.07"
          y2="180.365"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="1" stopColor="white" stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_647_1490"
          x1="225.125"
          y1="3.76617"
          x2="174.85"
          y2="109.528"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="1" stopColor="white" stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_647_1490"
          x1="192.625"
          y1="0.455022"
          x2="225.78"
          y2="70.8358"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="1" stopColor="white" stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default React.memo(Circles);

const styles = StyleSheet.create({});
