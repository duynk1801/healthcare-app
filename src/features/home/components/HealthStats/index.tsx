import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';

import type { IHealthStat, IHealthStatsProps } from './types';

const GRADIENT_CLASSES: Record<string, { bg: string; icon: string; value: string }> = {
  blue: {
    bg: 'bg-primary-50 border border-primary-100',
    icon: 'text-primary-500',
    value: 'text-primary-700',
  },
  green: {
    bg: 'bg-success-50 border border-success-100',
    icon: 'text-success-500',
    value: 'text-success-700',
  },
};

const StatCard: React.FC<{ item: IHealthStat }> = React.memo(({ item }) => {
  const style = GRADIENT_CLASSES[item.gradient] ?? GRADIENT_CLASSES.blue;

  return (
    <View className={`flex-1 ${style.bg} rounded-lg p-4 mx-1`}>
      <Text className='text-2xl mb-2'>{item.icon}</Text>
      <Text className='text-xs font-medium text-neutral-500 uppercase tracking-wide'>{item.label}</Text>
      <View className='flex-row items-baseline mt-1'>
        <Text className={`text-2xl font-bold ${style.value}`}>{item.value}</Text>
        <Text className='text-sm text-neutral-500 ml-1'>{item.unit}</Text>
      </View>
      {item.target && <Text className='text-xs text-neutral-400 mt-1'>Goal: {item.target}</Text>}
    </View>
  );
});

StatCard.displayName = 'StatCard';

const keyExtractor = (item: IHealthStat): string => item.id;

export const HealthStats: React.FC<IHealthStatsProps> = React.memo(({ stats }) => {
  const renderItem = useCallback(({ item }: { item: IHealthStat }) => <StatCard item={item} />, []);

  return (
    <View className='px-4 mb-6'>
      <Text className='text-lg font-bold text-neutral-900 mb-3'>Health Overview</Text>
      <FlatList
        data={stats}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{ flex: 1 }}
      />
    </View>
  );
});

HealthStats.displayName = 'HealthStats';
