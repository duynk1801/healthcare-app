// ─── Connection State ───

export type CallConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

// ─── Call Controls State ───

export interface ICallControlsState {
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  isFrontCamera: boolean;
}

export interface ICallControlsActions {
  toggleMic: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  switchCamera: () => Promise<void>;
  endCall: () => void;
}

export type IUseCallControlsReturn = ICallControlsState & ICallControlsActions;

// ─── Call UI Component Props ───

export interface ICallControlsProps {
  controls: IUseCallControlsReturn;
}

export interface ICallHeaderProps {
  status: CallConnectionStatus;
  participantCount: number;
}

// ─── Audio Recorder ───

export type RecorderStatus = 'idle' | 'recording' | 'stopped';

export interface IRecordingResult {
  uri: string;
  durationMs: number;
}

export interface IUseAudioRecorderReturn {
  status: RecorderStatus;
  isRecording: boolean;
  durationMs: number;
  recordingUri: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<IRecordingResult | null>;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
  // Playback
  isPlaying: boolean;
  playbackPositionMs: number;
  playRecording: () => Promise<void>;
  stopPlayback: () => Promise<void>;
}

// ─── Test Screen Props ───

export interface IJoinCallFormProps {
  onJoin: (url: string, token: string) => void;
  isLoading: boolean;
}
