export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IAvatarProps {
  /** Image URL — fallback to initials if empty */
  imageUrl?: string;
  /** Full name for initials fallback */
  name: string;
  /** Avatar size */
  size?: AvatarSize;
  /** Show online indicator dot */
  showOnline?: boolean;
  /** Is user online */
  isOnline?: boolean;
  /** Additional className */
  className?: string;
}
