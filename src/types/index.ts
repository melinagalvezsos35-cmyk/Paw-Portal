export type PageView = 'login' | 'home' | 'citas' | 'ventas' | 'inventario';

export type AppointmentStatus = 'por_confirmar' | 'confirmada' | 'cancelada';

export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  phone1: string;
  phone2: string;
  ineVerified: boolean;
  serviceType: string;
  assignedEmployee: string;
  isPaid: boolean;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface Product {
  id: string;
  name: string;
  category: 'alimentos' | 'medicamentos' | 'accesorios';
  price: number;
  stock: number;
}