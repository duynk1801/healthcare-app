import { Mic, MicOff, Pause, Play, Square } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAudioRecorderHook as useAudioRecorder } from '@/src/features/telemedicine/hooks/useAudioRecorder';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Duration Formatter ───

const formatDurationMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const pad2 = (n: number) => n.toString().padStart(2, '0');

  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(centiseconds)}`;
};

/**
 * Test screen for audio recording feature.
 * Uses useAudioRecorder hook to demonstrate recording + playback of medical notes.
 */
export default function TestRecorderScreen() {
  const {
    status,
    isRecording,
    durationMs,
    recordingUri,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
    isPlaying,
    playbackPositionMs,
    playRecording,
    stopPlayback,
  } = useAudioRecorder();

  // ─── Handlers (stable, no anon functions in render) ───

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleTogglePlayback = useCallback(async () => {
    if (isPlaying) {
      await stopPlayback();
    } else {
      await playRecording();
    }
  }, [isPlaying, playRecording, stopPlayback]);

  const handleRequestPermission = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  // ─── Status Display ───

  const statusConfig = useMemo(() => {
    if (isPlaying) {
      return { label: 'ĐANG PHÁT', color: '#2196F3', bgColor: '#E3F2FD' };
    }
    switch (status) {
      case 'recording':
        return { label: 'ĐANG GHI ÂM', color: '#F44336', bgColor: '#FFEBEE' };
      case 'stopped':
        return { label: 'ĐÃ DỪNG', color: '#4CAF50', bgColor: '#E8F5E9' };
      default:
        return { label: 'SẴN SÀNG', color: '#9E9E9E', bgColor: '#FAFAFA' };
    }
  }, [status, isPlaying]);

  // Playback progress percentage
  const playbackProgress = useMemo(() => {
    if (durationMs === 0) return 0;
    return Math.min((playbackPositionMs / durationMs) * 100, 100);
  }, [playbackPositionMs, durationMs]);

  const canPlayback = status === 'stopped' && recordingUri !== null && !isRecording;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              isRecording && styles.iconCircleRecording,
              isPlaying && styles.iconCirclePlaying,
            ]}
          >
            {isRecording ? (
              <MicOff size={SCREEN_WIDTH * 0.08} color='#FFFFFF' />
            ) : (
              <Mic size={SCREEN_WIDTH * 0.08} color='#FFFFFF' />
            )}
          </View>
          <Text style={styles.title}>Test Ghi Âm Bệnh Án</Text>
        </View>

        {/* Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            {isPlaying ? formatDurationMs(playbackPositionMs) : formatDurationMs(durationMs)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            {isRecording && <View style={styles.recordingDot} />}
            {isPlaying && <View style={styles.playingDot} />}
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>

          {/* Playback progress bar */}
          {canPlayback && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${playbackProgress}%` }]} />
              </View>
              <View style={styles.progressTimeRow}>
                <Text style={styles.progressTimeText}>{formatDurationMs(playbackPositionMs)}</Text>
                <Text style={styles.progressTimeText}>{formatDurationMs(durationMs)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Permission check */}
        {hasPermission === false && (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionText}>
              ⚠️ Chưa cấp quyền Micro. Vui lòng cấp quyền để ghi âm.
            </Text>
            <Pressable
              onPress={handleRequestPermission}
              style={styles.permissionButton}
              accessibilityRole='button'
              accessibilityLabel='Cấp quyền micro'
            >
              <Text style={styles.permissionButtonText}>Cấp quyền</Text>
            </Pressable>
          </View>
        )}

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          {/* Record/Stop Button */}
          <Pressable
            onPress={handleToggleRecording}
            style={({ pressed }) => [
              styles.mainButton,
              isRecording ? styles.stopButton : styles.recordButton,
              isPlaying && styles.buttonDisabled,
              pressed && !isPlaying && styles.buttonPressed,
            ]}
            disabled={isPlaying}
            accessibilityRole='button'
            accessibilityLabel={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
          >
            {isRecording ? (
              <>
                <Square size={SCREEN_WIDTH * 0.05} color='#FFFFFF' />
                <Text style={styles.mainButtonText}>Dừng</Text>
              </>
            ) : (
              <>
                <Mic size={SCREEN_WIDTH * 0.05} color='#FFFFFF' />
                <Text style={styles.mainButtonText}>Ghi âm</Text>
              </>
            )}
          </Pressable>

          {/* Play/Pause Button */}
          <Pressable
            onPress={handleTogglePlayback}
            style={({ pressed }) => [
              styles.mainButton,
              styles.playButton,
              !canPlayback && styles.buttonDisabled,
              pressed && canPlayback && styles.buttonPressed,
            ]}
            disabled={!canPlayback}
            accessibilityRole='button'
            accessibilityLabel={isPlaying ? 'Dừng phát' : 'Nghe lại'}
          >
            {isPlaying ? (
              <>
                <Pause size={SCREEN_WIDTH * 0.05} color='#FFFFFF' />
                <Text style={styles.mainButtonText}>Dừng phát</Text>
              </>
            ) : (
              <>
                <Play size={SCREEN_WIDTH * 0.05} color='#FFFFFF' />
                <Text style={styles.mainButtonText}>Nghe lại</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Result */}
        {status === 'stopped' && recordingUri && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✅ Ghi âm thành công!</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Thời lượng:</Text>
              <Text style={styles.resultValue}>{formatDurationMs(durationMs)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>File URI:</Text>
            </View>
            <Text style={styles.uriText} selectable>
              {recordingUri}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_WIDTH * 0.06,
    paddingBottom: SCREEN_WIDTH * 0.1,
  },

  // Header
  iconContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.06,
  },
  iconCircle: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleRecording: {
    backgroundColor: '#F44336',
  },
  iconCirclePlaying: {
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },

  // Timer
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.08,
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.06,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  timerText: {
    fontSize: SCREEN_WIDTH * 0.12,
    fontWeight: '700',
    color: '#212121',
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  playingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Progress bar
  progressBarContainer: {
    width: '100%',
    marginTop: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  progressTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressTimeText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontVariant: ['tabular-nums'],
  },

  // Permission
  permissionCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 13,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Buttons row
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SCREEN_WIDTH * 0.06,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Result
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '700',
  },
  uriText: {
    fontSize: 12,
    color: '#1B5E20',
    fontFamily: 'SpaceMono',
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    lineHeight: 18,
  },
});
