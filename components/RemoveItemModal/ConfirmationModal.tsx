import { useAppTheme } from '@/themes';
import React, { RefObject } from 'react';
import { Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import GradientButton from '../GradientButton/GradientButton';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import { removeItemModal } from './styles/RemoveItemModal.styles';

interface RemoveItemModalProps {
  modalizeRef: RefObject<Modalize>;
  title: string;
  subtitle: string;
  onCancellPress: () => void;
  onOkPress: () => void;
  okText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<RemoveItemModalProps> = ({
  modalizeRef,
  title,
  subtitle,
  onCancellPress,
  onOkPress,
  okText,
  cancelText,
}) => {
  const theme = useAppTheme();
  const styles = removeItemModal(theme);
  return (
    <BottomDrawer
      adjustToContentHeight
      modalStyle={styles.modal}
      FooterComponent={
        <View style={styles.modalFooter}>
          <GradientButton title={okText || 'Remove'} onPress={onOkPress} />
          <SecondaryButton
            buttonName={cancelText || 'Cancel'}
            onPress={onCancellPress}
          />
        </View>
      }
      modalRef={modalizeRef}
    >
      <View style={styles.content}>
        <Text style={styles.modalHeader}>{title}</Text>
        <Text style={styles.successDescription}>{subtitle}</Text>
      </View>
    </BottomDrawer>
  );
};

export default ConfirmationModal;
