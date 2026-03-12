// ─── Domain Types ───

export interface IPrescription {
  medication: string;
  dosage: string;
}

export interface IVisitDoctor {
  name: string;
  specialty: string;
}

export type IVisitType = 'Routine' | 'Emergency' | 'Follow-up' | 'Specialist';

export interface IVisit {
  id: string;
  title: string;
  date: string;
  type: IVisitType;
  doctor: IVisitDoctor;
  prescription?: IPrescription;
  notes?: string;
}

export interface IRecordSummary {
  id: string;
  label: string;
  value: number;
  color: string; // hex
}

// ─── Component Props ───

export interface IRecordSummaryCardsProps {
  summaries: IRecordSummary[];
}

export interface IVisitCardProps {
  visit: IVisit;
  onViewDetails?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export interface IVisitTimelineProps {
  visits: IVisit[];
  onViewDetails?: (id: string) => void;
  onDownload?: (id: string) => void;
}
