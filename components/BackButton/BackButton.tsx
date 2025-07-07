import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  handleBackPress: () => void;
  iconColor: string;
  disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  handleBackPress,
  iconColor = '#333333',
  disabled,
}) => {
  return (
    <TouchableOpacity
      hitSlop={25}
      disabled={disabled}
      onPress={handleBackPress}
    >
      <AntDesign name="arrowleft" size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
