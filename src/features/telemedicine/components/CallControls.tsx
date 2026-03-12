import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  SwitchCamera,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import type { ICallControlsProps } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_SIZE = SCREEN_WIDTH * 0.15;
const ICON_SIZE = SCREEN_WIDTH * 0.065;

/**
 * Pure presentational component for call control buttons.
 * All logic comes from useCallControls hook via props.
 */
export const CallControls: React.FC<ICallControlsProps> = React.memo(({ controls }) => {
  const { isMicEnabled, isCameraEnabled, toggleMic, toggleCamera, switchCamera, endCall } =
    controls;

  // Stable press handlers (no anonymous functions in render)
  const handleMicPress = useCallback(() => {
    toggleMic();
  }, [toggleMic]);

  const handleCameraPress = useCallback(() => {
    toggleCamera();
  }, [toggleCamera]);

  const handleSwitchPress = useCallback(() => {
    switchCamera();
  }, [switchCamera]);

  const handleEndPress = useCallback(() => {
    endCall();
  }, [endCall]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Mic Toggle */}
        <Pressable
          onPress={handleMicPress}
          style={({ pressed }) => [
            styles.button,
            !isMicEnabled && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel={isMicEnabled ? 'Tắt micro' : 'Bật micro'}
        >
          {isMicEnabled ? (
            <Mic size={ICON_SIZE} color='#FFFFFF' />
          ) : (
            <MicOff size={ICON_SIZE} color='#FFFFFF' />
          )}
        </Pressable>

        {/* Camera Toggle */}
        <Pressable
          onPress={handleCameraPress}
          style={({ pressed }) => [
            styles.button,
            !isCameraEnabled && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel={isCameraEnabled ? 'Tắt camera' : 'Bật camera'}
        >
          {isCameraEnabled ? (
            <Camera size={ICON_SIZE} color='#FFFFFF' />
          ) : (
            <CameraOff size={ICON_SIZE} color='#FFFFFF' />
          )}
        </Pressable>

        {/* Switch Camera */}
        <Pressable
          onPress={handleSwitchPress}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          accessibilityRole='button'
          accessibilityLabel='Chuyển camera'
        >
          <SwitchCamera size={ICON_SIZE} color='#FFFFFF' />
        </Pressable>

        {/* End Call */}
        <Pressable
          onPress={handleEndPress}
          style={({ pressed }) => [styles.endButton, pressed && styles.endButtonPressed]}
          accessibilityRole='button'
          accessibilityLabel='Kết thúc cuộc gọi'
        >
          <PhoneOff size={ICON_SIZE} color='#FFFFFF' />
        </Pressable>
      </View>
    </View>
  );
});

CallControls.displayName = 'CallControls';

// ─── Styles ───

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: SCREEN_WIDTH * 0.1,
    paddingTop: SCREEN_WIDTH * 0.05,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.05,
  },

  // Normal button
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonPressed: {
    opacity: 0.7,
  },

  // End call button
  endButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButtonPressed: {
    backgroundColor: '#D32F2F',
  },
});
