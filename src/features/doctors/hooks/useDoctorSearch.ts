import { useCallback, useMemo, useState } from 'react';

import type { IDoctor, IDoctorFilter } from '../types';

// ─── Mock Data ───

const MOCK_DOCTORS: IDoctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    experience: 15,
    location: 'Medical Center Downtown',
    price: 150,
    isAvailable: true,
    avatarGradient: ['#43A896', '#4A90D9'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'General Practice',
    rating: 4.8,
    experience: 12,
    location: 'Community Health Clinic',
    price: 100,
    isAvailable: true,
    avatarGradient: ['#4A90D9', '#43A896'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    experience: 10,
    location: "Children's Hospital",
    price: 120,
    isAvailable: false,
    avatarGradient: ['#43A896', '#4A90D9'],
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    rating: 4.7,
    experience: 18,
    location: 'Sports Medicine Center',
    price: 180,
    isAvailable: true,
    avatarGradient: ['#4A90D9', '#43A896'],
  },
  {
    id: '5',
    name: 'Dr. Lisa Park',
    specialty: 'General Practice',
    rating: 4.6,
    experience: 8,
    location: 'City Health Center',
    price: 90,
    isAvailable: true,
    avatarGradient: ['#43A896', '#4A90D9'],
  },
];

const INITIAL_FILTERS: IDoctorFilter[] = [
  { id: 'cardiology', label: 'Cardiology', type: 'specialty', value: 'Cardiology', isActive: false },
  { id: 'general', label: 'General Practice', type: 'specialty', value: 'General Practice', isActive: false },
  { id: 'pediatrics', label: 'Pediatrics', type: 'specialty', value: 'Pediatrics', isActive: false },
  { id: 'rating', label: '4.5+ Rating', type: 'rating', value: 4.5, isActive: false },
  { id: 'price', label: 'Under $150', type: 'price', value: 150, isActive: false },
];

// ─── Hook ───

interface IUseDoctorSearchReturn {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: IDoctorFilter[];
  toggleFilter: (id: string) => void;
  filteredDoctors: IDoctor[];
  resultCount: number;
}

export const useDoctorSearch = (): IUseDoctorSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IDoctorFilter[]>(INITIAL_FILTERS);

  const toggleFilter = useCallback((id: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  }, []);

  const filteredDoctors = useMemo(() => {
    let result = MOCK_DOCTORS;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
    }

    // Active filters
    const activeFilters = filters.filter((f) => f.isActive);
    if (activeFilters.length === 0) return result;

    const specialtyFilters = activeFilters.filter((f) => f.type === 'specialty').map((f) => f.value as string);

    const ratingFilter = activeFilters.find((f) => f.type === 'rating');
    const priceFilter = activeFilters.find((f) => f.type === 'price');

    return result.filter((doctor) => {
      // Specialty: OR logic (any match)
      if (specialtyFilters.length > 0 && !specialtyFilters.includes(doctor.specialty)) {
        return false;
      }
      // Rating: minimum
      if (ratingFilter && doctor.rating < (ratingFilter.value as number)) {
        return false;
      }
      // Price: maximum
      if (priceFilter && doctor.price > (priceFilter.value as number)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    filteredDoctors,
    resultCount: filteredDoctors.length,
  };
};
