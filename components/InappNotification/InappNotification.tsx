import { useNotification } from '@/contexts/NotificationContext';
import { AppTheme, useAppTheme } from '@/themes';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

const InAppNotification = () => {
  const theme = useAppTheme();
  const { notifications, removeNotification } = useNotification();

  const latestNotification =
    notifications.length > 0 ? notifications[notifications.length - 1] : null;

  useEffect(() => {
    if (!latestNotification) return;

    const timer = setTimeout(() => {
      removeNotification(latestNotification.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [latestNotification]);

  if (!latestNotification) return null;

  const getSnackbarColor = () => {
    switch (latestNotification.type) {
      case 'success':
        return theme.colors.primary;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.tertiary || 'blue';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Snackbar
      visible={!!latestNotification}
      wrapperStyle={{
        position: 'absolute',
        top: 30,
        width: '100%',
      }}
      onDismiss={() => removeNotification(latestNotification.id)}
      duration={7000}
      style={{
        backgroundColor: theme.colors.background,
        minHeight: 50,
        maxHeight: 80,
      }}
      onIconPress={() => removeNotification(latestNotification.id)}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <FontAwesome
          name={
            latestNotification.type === 'success'
              ? 'check-circle'
              : latestNotification.type === 'error'
                ? 'exclamation-circle'
                : 'info-circle'
          }
          size={21}
          color={
            latestNotification.type === 'success'
              ? theme.colors.primary
              : latestNotification.type === 'error'
                ? theme.colors.error
                : theme.colors.tertiary
          }
          style={{ marginRight: 12 }}
        />
        <Text
          style={{
            ...AppTheme.fonts.interNotification,
            color:
              latestNotification.type === 'success'
                ? theme.colors.primary
                : latestNotification.type === 'error'
                  ? theme.colors.error
                  : theme.colors.tertiary,
          }}
        >
          {latestNotification.message}
        </Text>
      </View>
    </Snackbar>
  );
};

export default InAppNotification;
