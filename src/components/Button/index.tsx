import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import type { ButtonSize, ButtonVariant, IButtonProps } from './types';

const VARIANT_CLASSES: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-700',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-primary-50 active:bg-primary-100',
    text: 'text-primary-500',
  },
  outline: {
    container: 'bg-transparent border border-neutral-300 active:bg-neutral-100',
    text: 'text-neutral-900',
  },
  danger: {
    container: 'bg-danger-500 active:bg-danger-700',
    text: 'text-white',
  },
  ghost: {
    container: 'bg-transparent active:bg-neutral-100',
    text: 'text-primary-500',
  },
};

const SIZE_CLASSES: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'px-3 py-1.5 rounded-sm',
    text: 'text-sm font-medium',
  },
  md: {
    container: 'px-4 py-2.5 rounded-md',
    text: 'text-base font-semibold',
  },
  lg: {
    container: 'px-6 py-3.5 rounded-lg',
    text: 'text-lg font-semibold',
  },
};

export const Button: React.FC<IButtonProps> = React.memo(
  ({
    title,
    children,
    variant = 'primary',
    size = 'md',
    onPress,
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
  }) => {
    const handlePress = useCallback(() => {
      if (!disabled && !loading) {
        onPress();
      }
    }, [disabled, loading, onPress]);

    const variantStyle = VARIANT_CLASSES[variant];
    const sizeStyle = SIZE_CLASSES[size];

    const containerClassName = `
      flex-row items-center justify-center
      ${sizeStyle.container}
      ${variantStyle.container}
      ${fullWidth ? 'w-full' : 'self-start'}
      ${disabled || loading ? 'opacity-50' : 'opacity-100'}
      ${className}
    `;

    const textClassName = `
      ${sizeStyle.text}
      ${variantStyle.text}
    `;

    const spinnerColor = variant === 'outline' || variant === 'ghost' ? '#2196F3' : '#FFFFFF';

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        className={containerClassName}
        accessibilityRole='button'
        accessibilityState={{ disabled: disabled || loading }}
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator size='small' color={spinnerColor} />
        ) : (
          <>
            {leftIcon && <View className='mr-2'>{leftIcon}</View>}
            {children ?? <Text className={textClassName}>{title}</Text>}
            {rightIcon && <View className='ml-2'>{rightIcon}</View>}
          </>
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
