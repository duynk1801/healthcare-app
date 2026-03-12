import React from 'react';
import { Text, View } from 'react-native';

import type { BadgeSize, BadgeVariant, IBadgeProps } from './types';

const VARIANT_CLASSES: Record<BadgeVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-50',
    text: 'text-primary-700',
  },
  success: {
    container: 'bg-success-50',
    text: 'text-success-700',
  },
  warning: {
    container: 'bg-warning-50',
    text: 'text-warning-700',
  },
  danger: {
    container: 'bg-danger-50',
    text: 'text-danger-700',
  },
  neutral: {
    container: 'bg-neutral-100',
    text: 'text-neutral-600',
  },
  info: {
    container: 'bg-teal-50',
    text: 'text-teal-700',
  },
};

const SIZE_CLASSES: Record<BadgeSize, { container: string; text: string }> = {
  sm: {
    container: 'px-2 py-0.5 rounded-full',
    text: 'text-xs',
  },
  md: {
    container: 'px-3 py-1 rounded-full',
    text: 'text-sm',
  },
};

export const Badge: React.FC<IBadgeProps> = React.memo(
  ({ label, variant = 'primary', size = 'sm', icon, className = '' }) => {
    const variantStyle = VARIANT_CLASSES[variant];
    const sizeStyle = SIZE_CLASSES[size];

    return (
      <View
        className={`
          flex-row items-center self-start
          ${sizeStyle.container}
          ${variantStyle.container}
          ${className}
        `}
        accessibilityLabel={label}
        accessibilityRole='text'
      >
        {icon && <View className='mr-1'>{icon}</View>}
        <Text className={`${sizeStyle.text} font-medium ${variantStyle.text}`}>{label}</Text>
      </View>
    );
  },
);

Badge.displayName = 'Badge';
