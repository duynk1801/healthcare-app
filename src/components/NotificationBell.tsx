import { useNotificationContext } from '@/src/components/NotificationProvider';
import { Bell } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Types ──────────────────────────────────────────────

interface INotificationBellProps {
  /** Override color, defaults to white */
  color?: string;
}

// ─── Component ──────────────────────────────────────────

export const NotificationBell: React.FC<INotificationBellProps> = React.memo(({ color = '#FFFFFF' }) => {
  const { badgeCount, clearBadge } = useNotificationContext();

  const handlePress = useCallback(() => {
    // Clear badge when user taps the bell
    if (badgeCount > 0) {
      clearBadge();
    }
    // TODO: Navigate to notification list screen
  }, [badgeCount, clearBadge]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      hitSlop={12}
      accessibilityLabel={`Notifications${badgeCount > 0 ? `, ${badgeCount} unread` : ''}`}
      accessibilityRole='button'
    >
      <Bell size={SCREEN_WIDTH * 0.06} color={color} strokeWidth={2} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
        </View>
      )}
    </Pressable>
  );
});

NotificationBell.displayName = 'NotificationBell';

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: SCREEN_WIDTH * 0.015,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: SCREEN_WIDTH * 0.045,
    height: SCREEN_WIDTH * 0.045,
    borderRadius: SCREEN_WIDTH * 0.0225,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.025,
    fontWeight: '700',
    textAlign: 'center',
  },
});
