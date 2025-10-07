import { useTabBarVisibility } from '@/contexts/TabBarContext';
import { useAppTheme } from '@/themes';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function TabLayout() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { isVisible } = useTabBarVisibility();

  function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    focused: boolean;
  }) {
    const { name, color, focused } = props;

    const iconColor = focused ? theme.colors.primary : theme.colors.black;
    const size = focused ? 21 : 18;

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: -10,
        }}
      >
        <Ionicons name={name} size={size} color={iconColor} />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.background,
        tabBarShowLabel: false,
        tabBarStyle: isVisible ? {} : { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home-outline" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Wallet"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="wallet-outline" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="person-outline" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
