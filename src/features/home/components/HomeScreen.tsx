import { NotificationBell } from '@/src/components/NotificationBell';
import { useNotificationContext } from '@/src/components/NotificationProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickActions } from './QuickActions';
import { UpcomingAppointments } from './UpcomingAppointments';
import { WellnessSection } from './WellnessSection';

import type { IQuickAction } from './QuickActions/types';
import type { IAppointment } from './UpcomingAppointments/types';
import type { IWorkout } from './WellnessSection/types';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Types ───

interface IHealthStat {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

// ─── Mock Data ───

const HEALTH_STATS: IHealthStat[] = [
  { id: 'steps', label: 'Steps', value: '8,547', subtext: 'Goal: 10,000', icon: '👟' },
  { id: 'heart', label: 'Heart Rate', value: '72', subtext: 'BPM', icon: '💓' },
];

const QUICK_ACTIONS: IQuickAction[] = [
  { id: 'book', label: 'Book\nAppointment', iconName: 'calendar-plus', route: '/doctors', color: '#2196F3' },
  { id: 'tele', label: 'Telemedicine', iconName: 'video', route: '/video', color: '#4CAF50' },
  { id: 'pharm', label: 'Pharmacy', iconName: 'pill', route: '/records', color: '#7B1FA2' },
  { id: 'records', label: 'Health\nRecords', iconName: 'heart', route: '/records', color: '#F44336' },
];

const APPOINTMENTS: IAppointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology Consultation',
    date: 'March 15, 2026',
    time: '10:30 AM',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'General Checkup',
    date: 'March 18, 2026',
    time: '2:30 PM',
  },
];

const WORKOUTS: IWorkout[] = [
  { id: '1', title: 'Morning Yoga', duration: '30 min session', emoji: '🧘‍♀️', color: '#9C27B0' },
  { id: '2', title: 'Cardio Workout', duration: '45 min HIIT', emoji: '🏃‍♂️', color: '#FF5722' },
  { id: '3', title: 'Meditation', duration: '15 min mindfulness', emoji: '🧘', color: '#2196F3' },
];

// ─── Glassmorphism Stat Card ───

const StatCard: React.FC<{ item: IHealthStat; isWide: boolean }> = React.memo(({ item, isWide }) => (
  <View style={[styles.statCard, isWide ? styles.statCardWide : styles.statCardNarrow]}>
    <View style={styles.statCardHeader}>
      <Text style={styles.statIcon}>{item.icon}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
    <Text style={styles.statValue}>{item.value}</Text>
    <Text style={styles.statSubtext}>{item.subtext}</Text>
  </View>
));

StatCard.displayName = 'StatCard';

// ─── HomeScreen ───

export const HomeScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const { sendTest } = useNotificationContext();

  const handleActionPress = useCallback(
    (route: string) => {
      router.push(route as never);
    },
    [router],
  );

  const handleAppointmentPress = useCallback((id: string) => {
    console.log('Appointment:', id);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Gradient Header with Health Stats ── */}
        <LinearGradient
          colors={['#4A90D9', '#43A896', '#5BBF9E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerRow}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.userName}>Sarah</Text>
              </View>
              <NotificationBell />
            </View>

            {/* Health Stats — Glassmorphism cards on gradient */}
            <View style={styles.statsRow}>
              <StatCard item={HEALTH_STATS[0]} isWide={true} />
              <StatCard item={HEALTH_STATS[1]} isWide={false} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── Content below gradient ── */}
        <View style={styles.contentBelow}>
          <QuickActions actions={QUICK_ACTIONS} onActionPress={handleActionPress} />

          {/* DEV: Test notification button */}
          {__DEV__ && (
            <Pressable onPress={sendTest} style={({ pressed }) => [styles.testButton, pressed && { opacity: 0.8 }]}>
              <Text style={styles.testButtonText}>🔔 Send Test Notification</Text>
            </Pressable>
          )}

          <WellnessSection workouts={WORKOUTS} />
          <UpcomingAppointments appointments={APPOINTMENTS} onAppointmentPress={handleAppointmentPress} />
        </View>
      </ScrollView>
    </View>
  );
});

HomeScreen.displayName = 'HomeScreen';

// ─── Styles ───

const STAT_GAP = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Header Gradient
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  // Health Stat Cards
  statsRow: {
    flexDirection: 'row',
    gap: STAT_GAP,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statCardWide: {
    flex: 1.6,
  },
  statCardNarrow: {
    flex: 1,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Content
  contentBelow: {
    paddingTop: 20,
  },
  // DEV test button
  testButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565C0',
  },
});
