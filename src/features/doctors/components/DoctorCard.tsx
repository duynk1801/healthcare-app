import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, MapPin, Star, Stethoscope } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import type { IDoctorCardProps } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const AVATAR_SIZE = SCREEN_WIDTH * 0.16;

export const DoctorCard: React.FC<IDoctorCardProps> = React.memo(({ doctor, onBookPress }) => {
  const handleBook = useCallback(() => onBookPress(doctor.id), [doctor.id, onBookPress]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Avatar with gradient + online dot */}
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={doctor.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          />
          {doctor.isAvailable && <View style={styles.onlineDot} />}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{doctor.name}</Text>

          {/* Specialty */}
          <View style={styles.metaRow}>
            <Stethoscope size={13} color='#9E9E9E' />
            <Text style={styles.metaText}>{doctor.specialty}</Text>
          </View>

          {/* Rating + Experience */}
          <View style={styles.metaRow}>
            <Star size={13} color='#FFA726' fill='#FFA726' />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
            <GraduationCap size={13} color='#9E9E9E' style={styles.metaIcon} />
            <Text style={styles.metaText}>{doctor.experience} years</Text>
          </View>

          {/* Location */}
          <View style={styles.metaRow}>
            <MapPin size={13} color='#9E9E9E' />
            <Text style={styles.metaText}>{doctor.location}</Text>
          </View>
        </View>
      </View>

      {/* Price + Book Now */}
      <View style={styles.footer}>
        <Text style={styles.price}>${doctor.price}</Text>
        {doctor.isAvailable ? (
          <Pressable
            onPress={handleBook}
            style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
            accessibilityRole='button'
            accessibilityLabel={`Book appointment with ${doctor.name}`}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </Pressable>
        ) : (
          <View style={styles.unavailableBtn}>
            <Text style={styles.unavailableBtnText}>Unavailable</Text>
          </View>
        )}
      </View>
    </View>
  );
});

DoctorCard.displayName = 'DoctorCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  // Avatar
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  // Info
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  metaText: {
    fontSize: 13,
    color: '#9E9E9E',
    marginLeft: 5,
  },
  metaIcon: {
    marginLeft: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 4,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  bookBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  bookBtnPressed: {
    backgroundColor: '#1E87E0',
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  unavailableBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  unavailableBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
});
