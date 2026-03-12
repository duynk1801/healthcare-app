export interface IHealthStat {
  id: string;
  label: string;
  value: string;
  unit: string;
  target?: string;
  icon: string;
  gradient: 'blue' | 'green';
}

export interface IHealthStatsProps {
  stats: IHealthStat[];
}
