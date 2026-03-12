import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface ICardProps {
  /** Card content */
  children: ReactNode;
  /** Visual variant */
  variant?: CardVariant;
  /** Press handler — makes card tappable */
  onPress?: () => void;
  /** Additional className */
  className?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}
