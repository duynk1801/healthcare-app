import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';

import type { CardVariant, ICardProps } from './types';

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-white rounded-lg p-4',
  elevated: 'bg-white rounded-lg p-4 shadow-card',
  outlined: 'bg-white rounded-lg p-4 border border-neutral-200',
};

export const Card: React.FC<ICardProps> = React.memo(
  ({ children, variant = 'elevated', onPress, className = '', accessibilityLabel }) => {
    const baseClassName = `${VARIANT_CLASSES[variant]} ${className}`;

    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    if (onPress) {
      return (
        <Pressable
          onPress={handlePress}
          className={`${baseClassName} active:opacity-90`}
          accessibilityRole='button'
          accessibilityLabel={accessibilityLabel}
        >
          {children}
        </Pressable>
      );
    }

    return (
      <View className={baseClassName} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';
