import { ChevronRight } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { IWellnessSectionProps, IWorkout } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.44;

const WorkoutCard: React.FC<{
  item: IWorkout;
  onPress?: (id: string) => void;
}> = React.memo(({ item, onPress }) => {
  const handlePress = useCallback(() => onPress?.(item.id), [item.id, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole='button'
      accessibilityLabel={item.title}
    >
      {/* Colored top half with emoji */}
      <View style={[styles.cardTop, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      {/* White bottom half */}
      <View style={styles.cardBottom}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDuration}>{item.duration}</Text>

        {/* Start Session CTA */}
        <View style={styles.ctaRow}>
          <Text style={[styles.ctaText, { color: item.color }]}>Start Session</Text>
          <ChevronRight size={14} color={item.color} />
        </View>
      </View>
    </Pressable>
  );
});

WorkoutCard.displayName = 'WorkoutCard';

const keyExtractor = (item: IWorkout): string => item.id;

export const WellnessSection: React.FC<IWellnessSectionProps> = React.memo(({ workouts, onWorkoutPress }) => {
  const renderItem = useCallback(
    ({ item }: { item: IWorkout }) => <WorkoutCard item={item} onPress={onWorkoutPress} />,
    [onWorkoutPress],
  );

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Wellness & Gym</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

WellnessSection.displayName = 'WellnessSection';

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  comingSoonBadge: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2196F3',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  // Card
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTop: {
    height: CARD_WIDTH * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  cardBottom: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  cardDuration: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 2,
  },
});
