import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { inAppNotificationStyles } from './InappNotification.styles';
import { useNotification } from '@/contexts/NotificationContext';
import { useAppTheme } from '@/themes';

const InAppNotification = () => {
  const theme = useAppTheme();
  const styles = inAppNotificationStyles(theme);
  const { t } = useTranslation();
  const { notifications, removeNotification } = useNotification();

  const NotificationItem = ({ notification, onDismiss }: any) => {
    const [exitAnimation, setExitAnimation] = useState<'slideOutLeft' | null>(
      null
    );

    useEffect(() => {
      const timer = setTimeout(() => {
        setExitAnimation('slideOutLeft');
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
      switch (notification.type) {
        case 'success':
          return (
            <FontAwesome
              name="check-circle"
              color={theme.colors.primary}
              size={30}
            />
          );
        case 'error':
          return (
            <FontAwesome name="exclamation-circle" size={30} color="red" />
          );
        case 'info':
          return <FontAwesome name="info-circle" size={30} color="blue" />;
        default:
          return null;
      }
    };

    return (
      <Animatable.View
        animation={exitAnimation || 'slideInRight'}
        duration={500}
        onAnimationEnd={() => {
          if (exitAnimation) {
            onDismiss();
          }
        }}
        style={styles.notification}
      >
        <View style={styles.textContainer}>
          {getIcon()}
          <Text style={styles.text}>{t(notification.message)}</Text>
        </View>
        <TouchableOpacity
          hitSlop={25}
          onPress={() => setExitAnimation('slideOutLeft')}
          style={styles.closeIconContainer}
        >
          <FontAwesome name="close" size={12} color={theme.colors.gray3Text} />
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </View>
  );
};

export default InAppNotification;
