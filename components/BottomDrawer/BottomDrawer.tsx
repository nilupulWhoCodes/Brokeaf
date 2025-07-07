import React, { ReactNode, RefObject } from 'react';
import { View } from 'react-native';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import { bottomDrawerStyles } from './styles/BottomDrawer.styles';
import { useAppTheme } from '@/themes';

interface BottomDrawerProps extends ModalizeProps {
  modalRef: RefObject<Modalize>;
  children: ReactNode;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  modalRef,
  children,
  ...props
}) => {
  const theme = useAppTheme();
  const styles = bottomDrawerStyles(theme);
  return (
    <Modalize
      modalHeight={props.modalHeight}
      adjustToContentHeight={props.adjustToContentHeight}
      ref={modalRef}
      modalStyle={[styles.modalStyles, props.modalStyle]}
      handleStyle={{ display: 'none' }}
      FooterComponent={
        props.FooterComponent && (
          <View style={styles.footerComponent}>{props.FooterComponent}</View>
        )
      }
      HeaderComponent={props.HeaderComponent && props.HeaderComponent}
    >
      <View
        style={[
          styles.modalBody,
          { paddingTop: props.HeaderComponent ? 24 : 34 },
        ]}
      >
        {children}
      </View>
    </Modalize>
  );
};

export default BottomDrawer;
