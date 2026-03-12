import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';

import type { AvatarSize, IAvatarProps } from './types';

/** Size tokens: [container, text, onlineDot] */
const SIZE_CONFIG: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-3 h-3' },
  lg: { container: 'w-14 h-14', text: 'text-lg', dot: 'w-3.5 h-3.5' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', dot: 'w-4 h-4' },
};

/** Generate gradient-like bg color from name (deterministic) */
const AVATAR_COLORS = [
  'bg-primary-100',
  'bg-success-100',
  'bg-teal-50',
  'bg-purple-50',
  'bg-warning-50',
  'bg-danger-50',
];

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const TEXT_COLORS: Record<string, string> = {
  'bg-primary-100': 'text-primary-700',
  'bg-success-100': 'text-success-700',
  'bg-teal-50': 'text-teal-700',
  'bg-purple-50': 'text-purple-700',
  'bg-warning-50': 'text-warning-700',
  'bg-danger-50': 'text-danger-700',
};

export const Avatar: React.FC<IAvatarProps> = React.memo(
  ({ imageUrl, name, size = 'md', showOnline = false, isOnline = false, className = '' }) => {
    const config = SIZE_CONFIG[size];
    const bgColor = useMemo(() => getColorFromName(name), [name]);
    const textColor = TEXT_COLORS[bgColor] ?? 'text-primary-700';

    const initials = useMemo(() => {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }, [name]);

    return (
      <View className={`relative ${className}`}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className={`${config.container} rounded-full`}
            accessibilityLabel={`${name}'s avatar`}
          />
        ) : (
          <View
            className={`${config.container} rounded-full ${bgColor} items-center justify-center`}
            accessibilityLabel={`${name}'s avatar`}
          >
            <Text className={`${config.text} font-bold ${textColor}`}>{initials}</Text>
          </View>
        )}

        {showOnline && (
          <View
            className={`
              absolute bottom-0 right-0
              ${config.dot} rounded-full
              ${isOnline ? 'bg-success-500' : 'bg-neutral-400'}
              border-2 border-white
            `}
            accessibilityLabel={isOnline ? 'Online' : 'Offline'}
          />
        )}
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';
