import { Audio } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { IRecordingResult, IUseAudioRecorderReturn, RecorderStatus } from '../types';

/**
 * Hook for recording & playing back medical notes audio using expo-av.
 * Independent from LiveKit — can be used anywhere.
 *
 * Features:
 * - Permission management (request microphone access)
 * - Start/stop recording with HIGH_QUALITY preset
 * - Real-time duration tracking (100ms interval)
 * - Playback recorded audio with position tracking
 * - Auto-cleanup on unmount
 */
export const useAudioRecorder = (): IUseAudioRecorderReturn => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPositionMs, setPlaybackPositionMs] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ─── Permission ───

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { granted } = await Audio.requestPermissionsAsync();
    setHasPermission(granted);
    return granted;
  }, []);

  // ─── Start Recording ───

  const startRecording = useCallback(async () => {
    // Ensure permission
    let permitted = hasPermission;
    if (!permitted) {
      permitted = await requestPermission();
      if (!permitted) return;
    }

    // Stop any existing playback first
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setPlaybackPositionMs(0);
    }

    // Configure audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Create recording with HIGH_QUALITY preset + status callback
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      (recordingStatus) => {
        if (recordingStatus.isRecording) {
          setDurationMs(recordingStatus.durationMillis);
        }
      },
      100, // Update every 100ms
    );

    recordingRef.current = recording;
    setStatus('recording');
    setRecordingUri(null);
    setDurationMs(0);
  }, [hasPermission, requestPermission]);

  // ─── Stop Recording ───

  const stopRecording = useCallback(async (): Promise<IRecordingResult | null> => {
    const recording = recordingRef.current;
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();

      // Reset audio mode for playback
      // IMPORTANT: Must disable recording mode AND configure playback output
      // On Android, without this the audio may route to earpiece instead of speaker
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const uri = recording.getURI();
      const finalDuration = durationMs;

      recordingRef.current = null;
      setStatus('stopped');

      if (uri) {
        setRecordingUri(uri);
        return { uri, durationMs: finalDuration };
      }

      return null;
    } catch (error) {
      console.error('Error stopping recording:', error);
      recordingRef.current = null;
      setStatus('stopped');
      return null;
    }
  }, [durationMs]);

  // ─── Playback Status Callback ───

  const onPlaybackStatusUpdate = useCallback((playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) return;

    setPlaybackPositionMs(playbackStatus.positionMillis);

    if (playbackStatus.didJustFinish) {
      setIsPlaying(false);
      setPlaybackPositionMs(0);
    }
  }, []);

  // ─── Play Recording ───

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;

    try {
      // Ensure audio mode is set for playback (not recording)
      // This is critical on Android — without it, audio may be silent
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // If sound already loaded, just play/replay
      if (soundRef.current) {
        const soundStatus = await soundRef.current.getStatusAsync();
        if (soundStatus.isLoaded) {
          // If finished, replay from start
          if (soundStatus.didJustFinish || !soundStatus.isPlaying) {
            await soundRef.current.setPositionAsync(0);
          }
          await soundRef.current.playAsync();
          setIsPlaying(true);
          return;
        }
      }

      // Load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 },
        onPlaybackStatusUpdate,
      );

      soundRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing recording:', error);
      setIsPlaying(false);
    }
  }, [recordingUri, onPlaybackStatusUpdate]);

  // ─── Stop Playback ───

  const stopPlayback = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
      } catch {
        // Ignore errors when stopping
      }
    }
    setIsPlaying(false);
  }, []);

  // ─── Cleanup on unmount ───

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {
          // Ignore cleanup errors
        });
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, []);

  const isRecording = status === 'recording';

  return {
    status,
    isRecording,
    durationMs,
    recordingUri,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
    // Playback
    isPlaying,
    playbackPositionMs,
    playRecording,
    stopPlayback,
  };
};
