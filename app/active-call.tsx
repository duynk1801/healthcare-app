import { LiveKitRoom } from '@livekit/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Alert, StatusBar, StyleSheet, View } from 'react-native';

import { CallContent } from '@/src/features/telemedicine/components/CallContent';
import { CallControls } from '@/src/features/telemedicine/components/CallControls';
import { CallHeader } from '@/src/features/telemedicine/components/CallHeader';
import { useCallControls } from '@/src/features/telemedicine/hooks/useCallControls';

// ─── Inner component that uses LiveKit context ───

const ActiveCallInner: React.FC = React.memo(() => {
  const handleEndCall = useCallback(() => {
    router.back();
  }, []);

  const controls = useCallControls(handleEndCall);

  const controlsProps = useMemo(() => ({ controls }), [controls]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CallContent />
      <CallHeader />
      <CallControls {...controlsProps} />
    </View>
  );
});

ActiveCallInner.displayName = 'ActiveCallInner';

// ─── Screen (wraps LiveKitRoom) ───

/**
 * Fullscreen video call screen.
 * Receives url + token from router params.
 * LiveKitRoom manages connection lifecycle — disconnect on unmount.
 */
export default function ActiveCallScreen() {
  const { url, token } = useLocalSearchParams<{ url: string; token: string }>();

  const handleDisconnected = useCallback(() => {
    // Auto-navigate back when disconnected
    if (router.canGoBack()) {
      router.back();
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    Alert.alert('Lỗi kết nối', error.message, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }, []);

  return (
    <LiveKitRoom
      serverUrl={url}
      token={token}
      connect={true}
      audio={true}
      video={true}
      onDisconnected={handleDisconnected}
      onError={handleError}
    >
      <ActiveCallInner />
    </LiveKitRoom>
  );
}

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
