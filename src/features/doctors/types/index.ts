// ─── Domain Types ───

export interface ISpecialty {
  id: string;
  label: string;
}

export interface IDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number; // years
  location: string;
  price: number;
  isAvailable: boolean;
  avatarUrl?: string;
  avatarGradient: [string, string]; // gradient colors for fallback avatar
}

export interface IBooking {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// ─── Filter Types ───

export type IDoctorFilterType = 'specialty' | 'rating' | 'price';

export interface IDoctorFilter {
  id: string;
  label: string;
  type: IDoctorFilterType;
  value: string | number;
  isActive: boolean;
}

// ─── Component Props ───

export interface IDoctorCardProps {
  doctor: IDoctor;
  onBookPress: (doctorId: string) => void;
}

export interface IDoctorListProps {
  doctors: IDoctor[];
  onBookPress: (doctorId: string) => void;
}

export interface ISpecialtyFilterProps {
  filters: IDoctorFilter[];
  onFilterToggle: (filterId: string) => void;
}

export interface IDoctorSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}
