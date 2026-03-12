import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import type { IDoctorFilter, ISpecialtyFilterProps } from '../types';

const FilterChip: React.FC<{
  filter: IDoctorFilter;
  onPress: (id: string) => void;
}> = React.memo(({ filter, onPress }) => {
  const handlePress = useCallback(() => onPress(filter.id), [filter.id, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.chip, filter.isActive && styles.chipActive]}
      accessibilityRole='button'
      accessibilityLabel={filter.label}
      accessibilityState={{ selected: filter.isActive }}
    >
      <Text style={[styles.chipText, filter.isActive && styles.chipTextActive]}>{filter.label}</Text>
    </Pressable>
  );
});

FilterChip.displayName = 'FilterChip';

const keyExtractor = (item: IDoctorFilter): string => item.id;

export const SpecialtyFilter: React.FC<ISpecialtyFilterProps> = React.memo(({ filters, onFilterToggle }) => {
  const renderItem = useCallback(
    ({ item }: { item: IDoctorFilter }) => <FilterChip filter={item} onPress={onFilterToggle} />,
    [onFilterToggle],
  );

  return (
    <FlatList
      data={filters}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
});

SpecialtyFilter.displayName = 'SpecialtyFilter';

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#424242',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
