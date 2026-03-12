import { Calendar, Clock } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { IAppointment, IUpcomingAppointmentsProps } from './types';

const AppointmentCard: React.FC<{
  item: IAppointment;
  onPress?: (id: string) => void;
}> = React.memo(({ item, onPress }) => {
  const handlePress = useCallback(() => onPress?.(item.id), [item.id, onPress]);

  // Generate initials for avatar fallback
  const initials = item.doctorName
    .split(' ')
    .filter((_, i) => i === 0 || i === item.doctorName.split(' ').length - 1)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole='button'
      accessibilityLabel={`Appointment with ${item.doctorName}`}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.doctorName}>{item.doctorName}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <View style={styles.metaRow}>
          <Calendar size={12} color='#9E9E9E' />
          <Text style={styles.metaText}>{item.date}</Text>
          <Clock size={12} color='#9E9E9E' style={styles.clockIcon} />
          <Text style={styles.metaText}>{item.time}</Text>
        </View>
      </View>
    </Pressable>
  );
});

AppointmentCard.displayName = 'AppointmentCard';

const keyExtractor = (item: IAppointment): string => item.id;

export const UpcomingAppointments: React.FC<IUpcomingAppointmentsProps> = React.memo(
  ({ appointments, onAppointmentPress }) => {
    const renderItem = useCallback(
      ({ item }: { item: IAppointment }) => <AppointmentCard item={item} onPress={onAppointmentPress} />,
      [onAppointmentPress],
    );

    if (appointments.length === 0) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <FlatList data={appointments} renderItem={renderItem} keyExtractor={keyExtractor} scrollEnabled={false} />
      </View>
    );
  },
);

UpcomingAppointments.displayName = 'UpcomingAppointments';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#F5F5F5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  details: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: '#9E9E9E',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    marginLeft: 4,
  },
  clockIcon: {
    marginLeft: 14,
  },
});
