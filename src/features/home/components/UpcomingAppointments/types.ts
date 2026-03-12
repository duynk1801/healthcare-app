export interface IAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  avatarUrl?: string;
}

export interface IUpcomingAppointmentsProps {
  appointments: IAppointment[];
  onAppointmentPress?: (id: string) => void;
}
