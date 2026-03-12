import type { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface IBadgeProps {
  /** Badge label text */
  label: string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Left icon element */
  icon?: ReactNode;
  /** Additional className */
  className?: string;
}
