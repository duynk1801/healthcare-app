import { CalendarPlus, Heart, Pill, Video } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import type { IQuickAction, IQuickActionsProps } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const HORIZONTAL_PAD = 20;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PAD * 2 - CARD_GAP) / 2;

// Map iconName string to Lucide component
const ICON_MAP: Record<string, React.FC<{ size: number; color: string }>> = {
  'calendar-plus': CalendarPlus,
  video: Video,
  pill: Pill,
  heart: Heart,
};

const ActionCard: React.FC<{
  item: IQuickAction;
  onPress: (route: string) => void;
}> = React.memo(({ item, onPress }) => {
  const handlePress = useCallback(() => onPress(item.route), [item.route, onPress]);
  const IconComponent = ICON_MAP[item.iconName];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole='button'
      accessibilityLabel={item.label.replace('\n', ' ')}
    >
      {/* Icon circle — positioned at center-right area */}
      <View style={styles.iconRow}>
        <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
          {IconComponent && <IconComponent size={22} color='#FFFFFF' />}
        </View>
      </View>

      {/* Label — bottom left */}
      <Text style={styles.label}>{item.label}</Text>
    </Pressable>
  );
});

ActionCard.displayName = 'ActionCard';

export const QuickActions: React.FC<IQuickActionsProps> = React.memo(({ actions, onActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <ActionCard key={action.id} item={action} onPress={onActionPress} />
        ))}
      </View>
    </View>
  );
});

QuickActions.displayName = 'QuickActions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PAD,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between',
    minHeight: CARD_WIDTH * 0.7,
  },
  cardPressed: {
    backgroundColor: '#F5F5F5',
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    lineHeight: 20,
  },
});
