import { prisma } from "./prisma.js";

const mockClinics = [
  {
    id: 1,
    name: 'Powai Paediatrics',
    doctorName: 'Dr. Nisha Iyer',
    specialization: 'Pediatrician',
    area: 'Powai',
    address: 'Powai Plaza, Hiranandani Gardens, Powai, Mumbai',
    phone: '+91 98765 43210',
    workingDays: 'Mon–Sat',
    openingTime: '09:00',
    closingTime: '21:00'
  },
  {
    id: 2,
    name: 'Malad ENT & Allergy Clinic',
    doctorName: 'Dr. Fatima Khan',
    specialization: 'ENT Specialist',
    area: 'Malad',
    address: 'Link Road, Malad West, Mumbai',
    phone: '+91 98765 43211',
    workingDays: 'Tue–Sun',
    openingTime: '09:00',
    closingTime: '21:00'
  },
  {
    id: 3,
    name: 'Bandra Skin & Hair Clinic',
    doctorName: 'Dr. Pooja Mehta',
    specialization: 'Dermatologist',
    area: 'Bandra',
    address: 'Pali Hill, Bandra West, Mumbai',
    phone: '+91 98765 43212',
    workingDays: 'Mon–Sat',
    openingTime: '09:00',
    closingTime: '21:00'
  },
  {
    id: 4,
    name: 'Sharma General Clinic',
    doctorName: 'Dr. Ramesh Sharma',
    specialization: 'General Physician',
    area: 'Andheri',
    address: 'SV Road, Andheri West, Mumbai',
    phone: '+91 98765 43213',
    workingDays: 'Mon–Fri',
    openingTime: '09:00',
    closingTime: '21:00'
  },
  {
    id: 5,
    name: 'Dadar Bone & Joint Clinic',
    doctorName: 'Dr. Vikram Patel',
    specialization: 'Orthopedic',
    area: 'Dadar',
    address: 'Gokhale Road, Dadar West, Mumbai',
    phone: '+91 98765 43214',
    workingDays: 'Mon–Sat',
    openingTime: '09:00',
    closingTime: '21:00'
  },
  {
    id: 6,
    name: 'Worli Dental Care',
    doctorName: 'Dr. Anjali Desai',
    specialization: 'Dentist',
    area: 'Worli',
    address: 'Worli Sea Face, Mumbai',
    phone: '+91 98765 43215',
    workingDays: 'Tue–Sun',
    openingTime: '09:00',
    closingTime: '21:00'
  }
];

async function seed() {
  try {
    console.log("Cleaning up database...");
    await prisma.queueEntry.deleteMany();
    await prisma.queue.deleteMany();
    await prisma.clinic.deleteMany();

    console.log("Seeding clinics...");
    for (const clinic of mockClinics) {
      await prisma.clinic.create({
        data: clinic
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
