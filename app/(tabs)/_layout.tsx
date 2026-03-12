import { useColorScheme } from '@/components/useColorScheme';
import { Tabs } from 'expo-router';
import { FileText, Home, Stethoscope, Video } from 'lucide-react-native';
import React from 'react';

/** Tab bar icon size */
const ICON_SIZE = 24;

/** Colors matching tailwind.config.js */
const TAB_COLORS = {
  light: { active: '#2196F3', inactive: '#BDBDBD' },
  dark: { active: '#3AA5F5', inactive: '#757575' },
} as const;

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = TAB_COLORS[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#424242' : '#EEEEEE',
          backgroundColor: colorScheme === 'dark' ? '#212121' : '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name='doctors'
        options={{
          title: 'Doctors',
          tabBarIcon: ({ color }) => <Stethoscope size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name='video'
        options={{
          title: 'Video',
          tabBarIcon: ({ color }) => <Video size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name='records'
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <FileText size={ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}
