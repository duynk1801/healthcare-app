import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';

export interface IInputProps extends Pick<
  TextInputProps,
  | 'placeholder'
  | 'value'
  | 'keyboardType'
  | 'secureTextEntry'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'maxLength'
  | 'multiline'
  | 'numberOfLines'
> {
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Input label (above input) */
  label?: string;
  /** Error message (below input) */
  error?: string;
  /** Left icon element (e.g. search icon) */
  leftIcon?: ReactNode;
  /** Right icon element (e.g. clear button) */
  rightIcon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional container className */
  className?: string;
}
