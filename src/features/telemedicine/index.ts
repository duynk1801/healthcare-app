// ─── Components ───
export { TelemedicineScreen } from './components/TelemedicineScreen';
export { CallContent } from './components/CallContent';
export { CallControls } from './components/CallControls';
export { CallHeader } from './components/CallHeader';

// ─── Hooks ───
export { useCallControls } from './hooks/useCallControls';
export { useAudioRecorder } from './hooks/useAudioRecorder';

// ─── Types ───
export type {
  CallConnectionStatus,
  ICallControlsState,
  ICallControlsActions,
  IUseCallControlsReturn,
  ICallControlsProps,
  ICallHeaderProps,
  RecorderStatus,
  IRecordingResult,
  IUseAudioRecorderReturn,
} from './types';
