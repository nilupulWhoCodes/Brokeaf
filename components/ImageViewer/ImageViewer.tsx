import BackButton from '@/components/BackButton/BackButton';
import { EDIT } from '@/constants/common';
import { useAppTheme } from '@/themes';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { imageViewerWithHeaderStyles } from './styles/ImageViewerWithHeader.styles';

interface ImageViewerWithHeaderProps<T> {
  files: T[];
  selectedIndex: number;
  isViewerVisible: boolean;
  setViewerVisible: (val: false) => void;
  onDelete?: (index: number) => void;
  getUri: (file: T) => string;
  getId: (file: T, index: number) => string | number;
  mode: typeof EDIT;
}

const ImageViewerWithHeader = <T,>({
  files,
  isViewerVisible,
  selectedIndex,
  setViewerVisible,
  onDelete,
  getUri,
  mode,
  getId,
}: ImageViewerWithHeaderProps<T>) => {
  const theme = useAppTheme();
  const styles = imageViewerWithHeaderStyles(theme);

  const images = files?.map((file, index) => ({
    uri: getUri(file),
    id: getId(file, index),
  }));

  return (
    <ImageViewing
      images={images}
      imageIndex={selectedIndex}
      visible={isViewerVisible}
      onRequestClose={() => setViewerVisible(false)}
      HeaderComponent={() => (
        <View style={styles.headerContainer}>
          <BackButton
            iconColor={theme.colors.background}
            handleBackPress={() => setViewerVisible(false)}
          />
          {mode === EDIT && (
            <TouchableOpacity
              onPress={() => onDelete?.(selectedIndex)}
              style={styles.closeButton}
            >
              <MaterialIcons
                name="delete-outline"
                size={24}
                color={theme.colors.background}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default ImageViewerWithHeader;
