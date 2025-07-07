import React, { ReactNode } from 'react';
import { useNavigation } from 'expo-router';
import { Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { headerStyles } from './styles/header.styles';
import { useAppTheme } from '@/themes';

interface HeaderProps {
  title?: string;
  backIcon: () => ReactNode;
  actionIcon?: () => ReactNode;
  titleStyle?: TextStyle;
  onBackPress?: () => void;
  backBtnDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onBackPress,
  backIcon,
  titleStyle,
  title,
  actionIcon = () => <></>,
}) => {
  const theme = useAppTheme();
  const styles = headerStyles(theme);
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          hitSlop={50}
          onPress={onBackPress ?? navigation.goBack}
          style={styles.iconContainer}
        >
          {backIcon()}
        </TouchableOpacity>
        <Text style={titleStyle ? titleStyle : styles.headerText}>{title}</Text>
        <View style={styles.iconRightContainer}>{actionIcon()}</View>
      </View>
    </View>
  );
};

export default Header;
