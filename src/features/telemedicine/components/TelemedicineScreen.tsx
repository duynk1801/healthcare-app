import { router } from 'expo-router';
import { Mic, MonitorPlay, Video } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ITestOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const TEST_OPTIONS: ITestOption[] = [
  {
    id: 'video-call',
    title: 'Test Cuộc Gọi Video',
    description: 'Kết nối LiveKit Room và test video call với bác sĩ',
    icon: <Video size={SCREEN_WIDTH * 0.07} color='#FFFFFF' />,
    route: '/test-call',
    color: '#2196F3',
  },
  {
    id: 'audio-recorder',
    title: 'Test Ghi Âm Bệnh Án',
    description: 'Ghi âm ghi chú bệnh án và kiểm tra file output',
    icon: <Mic size={SCREEN_WIDTH * 0.07} color='#FFFFFF' />,
    route: '/test-recorder',
    color: '#4CAF50',
  },
];

/**
 * Telemedicine tab screen — hub for video call and audio recording features.
 * Replaces the old placeholder screen.
 */
export const TelemedicineScreen: React.FC = React.memo(() => {
  const handleNavigate = useCallback((route: string) => {
    router.push(route as never);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <MonitorPlay size={SCREEN_WIDTH * 0.07} color='#2196F3' />
        <Text style={styles.headerTitle}>Telemedicine</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Kết nối với bác sĩ qua video call hoặc ghi âm ghi chú bệnh án
      </Text>

      {/* Test Options */}
      <View style={styles.optionsContainer}>
        {TEST_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleNavigate(option.route)}
            style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
            accessibilityRole='button'
            accessibilityLabel={option.title}
          >
            <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
              {option.icon}
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          ℹ️ Video call sử dụng LiveKit WebRTC — xử lý hoàn toàn trên native threads, không ảnh
          hưởng đến hiệu năng ứng dụng.
        </Text>
      </View>
    </SafeAreaView>
  );
});

TelemedicineScreen.displayName = 'TelemedicineScreen';

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: SCREEN_WIDTH * 0.06,
    lineHeight: 20,
  },

  // Options
  optionsContainer: {
    gap: 14,
    marginBottom: SCREEN_WIDTH * 0.06,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  optionCardPressed: {
    backgroundColor: '#FAFAFA',
  },
  optionIcon: {
    width: SCREEN_WIDTH * 0.14,
    height: SCREEN_WIDTH * 0.14,
    borderRadius: SCREEN_WIDTH * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },

  // Info
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
  },
});
