import { isTrackReference, useConnectionState, useTracks } from '@livekit/react-native';
import { VideoTrack } from '@livekit/react-native';
import { ConnectionState, Track } from 'livekit-client';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PIP_WIDTH = SCREEN_WIDTH * 0.3;
const PIP_HEIGHT = PIP_WIDTH * 1.33;

/**
 * Renders video tracks: remote fullscreen + local PiP overlay.
 * MUST be used inside <LiveKitRoom>.
 *
 * Threading: VideoTrack uses native SurfaceViewRenderer (OpenGL) —
 * video frames never pass through JS thread.
 */
export const CallContent: React.FC = React.memo(() => {
  const connectionState = useConnectionState();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
  );

  // Split tracks into remote and local
  const { remoteCameraTrack, localCameraTrack } = useMemo(() => {
    const cameraTracks = tracks.filter(
      (t) => isTrackReference(t) && t.source === Track.Source.Camera,
    );

    const local = cameraTracks.find((t) => t.participant.isLocal);
    const remote = cameraTracks.find((t) => !t.participant.isLocal);

    return {
      localCameraTrack: local,
      remoteCameraTrack: remote,
    };
  }, [tracks]);

  // ─── Connecting / Error States ───

  if (connectionState === ConnectionState.Connecting) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.statusText}>Đang kết nối...</Text>
      </View>
    );
  }

  if (connectionState === ConnectionState.Disconnected) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.statusText}>Đã ngắt kết nối</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Remote Video — fullscreen */}
      {remoteCameraTrack && isTrackReference(remoteCameraTrack) ? (
        <VideoTrack
          trackRef={remoteCameraTrack}
          style={styles.remoteVideo}
          objectFit='cover'
          zOrder={0}
        />
      ) : (
        <View style={styles.remoteVideoPlaceholder}>
          <Text style={styles.placeholderText}>Đang chờ bác sĩ...</Text>
          <Text style={styles.placeholderSubtext}>Video sẽ hiển thị khi đối phương kết nối</Text>
        </View>
      )}

      {/* Local Video — PiP overlay */}
      {localCameraTrack && isTrackReference(localCameraTrack) && (
        <View style={styles.pipContainer}>
          <VideoTrack
            trackRef={localCameraTrack}
            style={styles.pipVideo}
            objectFit='cover'
            mirror={true}
            zOrder={1}
          />
        </View>
      )}
    </View>
  );
});

CallContent.displayName = 'CallContent';

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Remote video
  remoteVideo: {
    flex: 1,
  },
  remoteVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },

  // Local PiP
  pipContainer: {
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.3,
    right: SCREEN_WIDTH * 0.04,
    width: PIP_WIDTH,
    height: PIP_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pipVideo: {
    flex: 1,
  },
});
