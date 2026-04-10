export interface Clinic {
  id: string;
  name: string;
  doctor: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  waiting: number;
  queueStatus: 'open' | 'closed';
  workingDays?: string;
}

export const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Powai Paediatrics',
    doctor: 'Dr. Nisha Iyer',
    specialty: 'Pediatrician',
    location: 'Powai',
    rating: 4.9,
    reviewCount: 311,
    verified: true,
    waiting: 0,
    queueStatus: 'open',
    workingDays: 'Mon–Sat'
  },
  {
    id: '2',
    name: 'Malad ENT & Allergy Clinic',
    doctor: 'Dr. Fatima Khan',
    specialty: 'ENT Specialist',
    location: 'Malad',
    rating: 4.4,
    reviewCount: 76,
    verified: false,
    waiting: 0,
    queueStatus: 'open',
    workingDays: 'Tue–Sun'
  },
  {
    id: '3',
    name: 'Bandra Skin & Hair Clinic',
    doctor: 'Dr. Pooja Mehta',
    specialty: 'Dermatologist',
    location: 'Bandra',
    rating: 4.8,
    reviewCount: 214,
    verified: true,
    waiting: 3,
    queueStatus: 'open',
    workingDays: 'Mon–Sat'
  },
  {
    id: '4',
    name: 'Sharma General Clinic',
    doctor: 'Dr. Ramesh Sharma',
    specialty: 'General Physician',
    location: 'Andheri',
    rating: 4.5,
    reviewCount: 128,
    verified: true,
    waiting: 5,
    queueStatus: 'open',
    workingDays: 'Mon–Fri'
  },
  {
    id: '5',
    name: 'Dadar Bone & Joint Clinic',
    doctor: 'Dr. Vikram Patel',
    specialty: 'Orthopedic',
    location: 'Dadar',
    rating: 4.7,
    reviewCount: 189,
    verified: true,
    waiting: 2,
    queueStatus: 'open',
    workingDays: 'Mon–Sat'
  },
  {
    id: '6',
    name: 'Worli Dental Care',
    doctor: 'Dr. Anjali Desai',
    specialty: 'Dentist',
    location: 'Worli',
    rating: 4.6,
    reviewCount: 95,
    verified: false,
    waiting: 1,
    queueStatus: 'open',
    workingDays: 'Tue–Sun'
  }
];
