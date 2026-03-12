import { useConnectionState, useParticipants } from '@livekit/react-native';
import { ConnectionState } from 'livekit-client';
import { Users } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Status Config ───

interface IStatusConfig {
  label: string;
  dotColor: string;
}

const STATUS_MAP: Record<string, IStatusConfig> = {
  [ConnectionState.Connected]: { label: 'Đã kết nối', dotColor: '#4CAF50' },
  [ConnectionState.Connecting]: { label: 'Đang kết nối...', dotColor: '#FFC107' },
  [ConnectionState.Reconnecting]: { label: 'Đang kết nối lại...', dotColor: '#FFC107' },
  [ConnectionState.Disconnected]: { label: 'Đã ngắt', dotColor: '#F44336' },
};

const DEFAULT_STATUS: IStatusConfig = { label: 'Đang chờ...', dotColor: '#9E9E9E' };

// ─── Duration Formatter ───

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * Header bar showing connection status, call duration, and participant count.
 * MUST be used inside <LiveKitRoom>.
 */
export const CallHeader: React.FC = React.memo(() => {
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer: start counting when connected, stop when not
  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [connectionState]);

  const statusConfig = useMemo(
    () => STATUS_MAP[connectionState] ?? DEFAULT_STATUS,
    [connectionState],
  );

  const participantCount = participants.length;

  return (
    <View style={styles.container}>
      {/* Status badge */}
      <View style={styles.statusBadge}>
        <View style={[styles.statusDot, { backgroundColor: statusConfig.dotColor }]} />
        <Text style={styles.statusText}>{statusConfig.label}</Text>
      </View>

      {/* Duration */}
      {connectionState === ConnectionState.Connected && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      )}

      {/* Participant count */}
      <View style={styles.participantBadge}>
        <Users size={14} color='#FFFFFF' />
        <Text style={styles.participantText}>{participantCount}</Text>
      </View>
    </View>
  );
});

CallHeader.displayName = 'CallHeader';

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_WIDTH * 0.12,
    paddingBottom: SCREEN_WIDTH * 0.03,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },

  // Status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Duration
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // Participants
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  participantText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
