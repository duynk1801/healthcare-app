export interface IWorkout {
  id: string;
  title: string;
  duration: string;
  emoji: string;
  color: string; // hex background color for top half
}

export interface IWellnessSectionProps {
  workouts: IWorkout[];
  onWorkoutPress?: (id: string) => void;
}
