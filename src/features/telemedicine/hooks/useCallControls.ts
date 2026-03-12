import { Track } from 'livekit-client';
import type { LocalVideoTrack } from 'livekit-client';
import { useCallback, useState } from 'react';

import { useRoomContext } from '@livekit/react-native';

import type { IUseCallControlsReturn } from '../types';

/**
 * Thin hook managing call control actions (mic, camera, end call).
 * MUST be used inside a <LiveKitRoom> context.
 *
 * Why separate hook?
 * - Separation of concerns: UI components stay pure presentational
 * - Reusable: any component inside LiveKitRoom can use this
 * - Testable: can mock this hook independently
 */
export const useCallControls = (onEndCall?: () => void): IUseCallControlsReturn => {
  const room = useRoomContext();
  const localParticipant = room.localParticipant;

  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // ─── Read state from localParticipant ───

  const isMicEnabled = localParticipant.isMicrophoneEnabled;
  const isCameraEnabled = localParticipant.isCameraEnabled;

  // ─── Actions ───

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  }, [localParticipant]);

  const toggleCamera = useCallback(async () => {
    await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  }, [localParticipant]);

  const switchCamera = useCallback(async () => {
    const cameraPub = localParticipant.getTrackPublication(Track.Source.Camera);
    const track = cameraPub?.track as LocalVideoTrack | undefined;

    if (track) {
      await track.restartTrack({
        facingMode: isFrontCamera ? 'environment' : 'user',
      });
      setIsFrontCamera((prev) => !prev);
    }
  }, [localParticipant, isFrontCamera]);

  const endCall = useCallback(() => {
    room.disconnect();
    onEndCall?.();
  }, [room, onEndCall]);

  return {
    isMicEnabled,
    isCameraEnabled,
    isFrontCamera,
    toggleMic,
    toggleCamera,
    switchCamera,
    endCall,
  };
};
