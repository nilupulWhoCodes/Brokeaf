import { useAppTheme } from '@/themes';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    focused: boolean;
  }) {
    const { name, color, focused } = props;

    const backgroundColor = focused
      ? theme.colors.primary
      : theme.colors.gray7Bg;

    const iconColor = focused ? theme.colors.background : theme.colors.black;

    return (
      <View
        style={{
          backgroundColor,
          padding: 8,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 40,
          marginBottom: -10,
        }}
      >
        <FontAwesome name={name} size={18} color={iconColor} />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.background,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Wallet"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="money" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
