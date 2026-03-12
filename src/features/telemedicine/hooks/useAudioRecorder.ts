import {
  createAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { IRecordingResult, IUseAudioRecorderReturn, RecorderStatus } from '../types';

/**
 * Hook for recording & playing back medical notes audio using expo-audio.
 * Replaces expo-av (deprecated in SDK 55).
 *
 * Why NOT using useAudioPlayer hook:
 * - useAudioPlayer(null) crashes on mount when no URI exists yet
 * - Using createAudioPlayer() imperatively gives us control
 *   over when to create/destroy the player instance
 */
export const useAudioRecorderHook = (): IUseAudioRecorderReturn => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [finalDurationMs, setFinalDurationMs] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPositionMs, setPlaybackPositionMs] = useState(0);

  const playerRef = useRef<AudioPlayer | null>(null);
  const positionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Recorder (expo-audio built-in hook) ───

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 100);

  // ─── Derived state ───

  const isRecording = recorderState.isRecording;
  const durationMs =
    status === 'recording'
      ? recorderState.durationMillis
      : finalDurationMs;

  // Sync recorder status
  useEffect(() => {
    if (recorderState.isRecording && status !== 'recording') {
      setStatus('recording');
    }
  }, [recorderState.isRecording, status]);

  // ─── Permission ───

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await requestRecordingPermissionsAsync();
    setHasPermission(result.granted);
    return result.granted;
  }, []);

  // ─── Cleanup player ───

  const cleanupPlayer = useCallback(() => {
    if (positionIntervalRef.current) {
      clearInterval(positionIntervalRef.current);
      positionIntervalRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.remove();
      playerRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackPositionMs(0);
  }, []);

  // ─── Start Recording ───

  const startRecording = useCallback(async () => {
    let permitted = hasPermission;
    if (!permitted) {
      permitted = await requestPermission();
      if (!permitted) return;
    }

    // Stop any playback
    cleanupPlayer();

    // Set audio mode for recording
    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    setRecordingUri(null);
    setFinalDurationMs(0);
    setStatus('recording');

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  }, [hasPermission, requestPermission, audioRecorder, cleanupPlayer]);

  // ─── Stop Recording ───

  const stopRecording = useCallback(async (): Promise<IRecordingResult | null> => {
    try {
      await audioRecorder.stop();

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const uri = audioRecorder.uri;
      const duration = recorderState.durationMillis;

      setStatus('stopped');
      setFinalDurationMs(duration);

      if (uri) {
        setRecordingUri(uri);
        return { uri, durationMs: duration };
      }

      return null;
    } catch (error) {
      console.error('Error stopping recording:', error);
      setStatus('stopped');
      return null;
    }
  }, [audioRecorder, recorderState.durationMillis]);

  // ─── Play Recording ───

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;

    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      // Create player if not exists
      if (!playerRef.current) {
        playerRef.current = createAudioPlayer({ uri: recordingUri });
      }

      const currentPlayer = playerRef.current;
      if (!currentPlayer) return;

      currentPlayer.play();
      setIsPlaying(true);

      // Poll position every 100ms
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
      positionIntervalRef.current = setInterval(() => {
        if (!playerRef.current) return;

        const currentTimeSec = playerRef.current.currentTime;
        const durationSec = playerRef.current.duration;

        setPlaybackPositionMs(Math.round(currentTimeSec * 1000));

        // Check if playback finished
        if (durationSec > 0 && currentTimeSec >= durationSec) {
          setIsPlaying(false);
          setPlaybackPositionMs(0);
          playerRef.current.seekTo(0);
          playerRef.current.pause();
          if (positionIntervalRef.current) {
            clearInterval(positionIntervalRef.current);
            positionIntervalRef.current = null;
          }
        }
      }, 100);
    } catch (error) {
      console.error('Error playing recording:', error);
      setIsPlaying(false);
    }
  }, [recordingUri]);

  // ─── Stop Playback ───

  const stopPlayback = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
    if (positionIntervalRef.current) {
      clearInterval(positionIntervalRef.current);
      positionIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // ─── Cleanup on unmount ───

  useEffect(() => {
    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, []);

  return {
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
  };
};
