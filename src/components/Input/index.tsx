import React, { useCallback, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { IInputProps } from './types';

export const Input: React.FC<IInputProps> = React.memo(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    leftIcon,
    rightIcon,
    disabled = false,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    autoComplete,
    maxLength,
    multiline,
    numberOfLines,
    className = '',
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const borderColor = error ? 'border-danger-500' : isFocused ? 'border-primary-500' : 'border-neutral-300';

    const inputContainerClassName = `
      flex-row items-center
      bg-white rounded-md border ${borderColor}
      px-3 py-2.5
      ${disabled ? 'opacity-50 bg-neutral-100' : ''}
    `;

    return (
      <View className={`${className}`}>
        {label && <Text className='text-sm font-medium text-neutral-700 mb-1.5'>{label}</Text>}

        <View className={inputContainerClassName}>
          {leftIcon && <View className='mr-2'>{leftIcon}</View>}

          <TextInput
            className='flex-1 text-base text-neutral-900 p-0'
            placeholder={placeholder}
            placeholderTextColor='#BDBDBD'
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            accessibilityLabel={label ?? placeholder}
          />

          {rightIcon && <View className='ml-2'>{rightIcon}</View>}
        </View>

        {error && <Text className='text-xs text-danger-500 mt-1'>{error}</Text>}
      </View>
    );
  },
);

Input.displayName = 'Input';
