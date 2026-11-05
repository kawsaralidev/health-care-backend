import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { DoctorVerificationStatus, Role } from "../../generated/prisma/enums";

// Default password for all demo doctor accounts
const DEFAULT_PASSWORD = "Doctor@12345";

// ==========================================
// DOCTOR SEED DATA (36 DEMO DOCTORS)
// ==========================================

const doctors = [
  // 1. Cardiology
  {
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Cardiology",
    licenseNumber: "DEMO-BMD-0001",
    qualifications: "MBBS, MD (Cardiology)",
    experienceYears: 12,
    bio: "Experienced cardiologist specializing in heart diseases and cardiovascular health.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0001",
  },
  {
    name: "Dr. Mahmud Hasan",
    email: "mahmud.hasan@healthcare.test",
    address: "Gulshan, Dhaka",
    specialization: "Cardiology",
    licenseNumber: "DEMO-BMD-0002",
    qualifications: "MBBS, FCPS (Cardiology)",
    experienceYears: 15,
    bio: "Senior cardiologist with expertise in hypertension and heart disease management.",
    consultationFee: 1200.0,
    contactNumber: "DEMO-CONTACT-0002",
  },

  // 2. Neurology
  {
    name: "Dr. Tanvir Rahman",
    email: "tanvir.rahman@healthcare.test",
    address: "Uttara, Dhaka",
    specialization: "Neurology",
    licenseNumber: "DEMO-BMD-0003",
    qualifications: "MBBS, MD (Neurology)",
    experienceYears: 10,
    bio: "Neurologist specializing in migraine, epilepsy and neurological disorders.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0003",
  },
  {
    name: "Dr. Nusrat Jahan",
    email: "nusrat.jahan@healthcare.test",
    address: "Mirpur, Dhaka",
    specialization: "Neurology",
    licenseNumber: "DEMO-BMD-0004",
    qualifications: "MBBS, FCPS (Neurology)",
    experienceYears: 8,
    bio: "Neurology specialist focusing on brain and nervous system disorders.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0004",
  },

  // 3. Dermatology
  {
    name: "Dr. Ayesha Khan",
    email: "ayesha.khan@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Dermatology",
    licenseNumber: "DEMO-BMD-0005",
    qualifications: "MBBS, DDV, FCPS (Dermatology)",
    experienceYears: 9,
    bio: "Dermatologist specializing in skin diseases, acne and hair disorders.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0005",
  },
  {
    name: "Dr. Fahim Chowdhury",
    email: "fahim.chowdhury@healthcare.test",
    address: "Banani, Dhaka",
    specialization: "Dermatology",
    licenseNumber: "DEMO-BMD-0006",
    qualifications: "MBBS, MD (Dermatology)",
    experienceYears: 11,
    bio: "Experienced skin specialist focusing on clinical dermatology.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0006",
  },

  // 4. Orthopedics
  {
    name: "Dr. Imran Hossain",
    email: "imran.hossain@healthcare.test",
    address: "Bogura Sadar, Bogura",
    specialization: "Orthopedics",
    licenseNumber: "DEMO-BMD-0007",
    qualifications: "MBBS, MS (Orthopedics)",
    experienceYears: 14,
    bio: "Orthopedic specialist focusing on bone, joint and fracture treatment.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0007",
  },
  {
    name: "Dr. Sadiya Islam",
    email: "sadiya.islam@healthcare.test",
    address: "Rajshahi Sadar, Rajshahi",
    specialization: "Orthopedics",
    licenseNumber: "DEMO-BMD-0008",
    qualifications: "MBBS, FCPS (Orthopedics)",
    experienceYears: 7,
    bio: "Orthopedic doctor specializing in joint pain and musculoskeletal conditions.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0008",
  },

  // 5. Pediatrics
  {
    name: "Dr. Farhana Akter",
    email: "farhana.akter@healthcare.test",
    address: "Uttara, Dhaka",
    specialization: "Pediatrics",
    licenseNumber: "DEMO-BMD-0009",
    qualifications: "MBBS, FCPS (Pediatrics)",
    experienceYears: 13,
    bio: "Pediatric specialist providing healthcare for infants and children.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0009",
  },
  {
    name: "Dr. Arif Hossain",
    email: "arif.hossain@healthcare.test",
    address: "Chattogram Sadar, Chattogram",
    specialization: "Pediatrics",
    licenseNumber: "DEMO-BMD-0010",
    qualifications: "MBBS, MD (Pediatrics)",
    experienceYears: 8,
    bio: "Child health specialist focusing on childhood illnesses and development.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0010",
  },

  // 6. Gynecology
  {
    name: "Dr. Samia Rahman",
    email: "samia.rahman@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Gynecology",
    licenseNumber: "DEMO-BMD-0011",
    qualifications: "MBBS, FCPS (Gynecology and Obstetrics)",
    experienceYears: 15,
    bio: "Gynecology specialist focusing on women's reproductive health.",
    consultationFee: 1200.0,
    contactNumber: "DEMO-CONTACT-0011",
  },
  {
    name: "Dr. Rukaiya Ahmed",
    email: "rukaiya.ahmed@healthcare.test",
    address: "Sylhet Sadar, Sylhet",
    specialization: "Gynecology",
    licenseNumber: "DEMO-BMD-0012",
    qualifications: "MBBS, MS (Obstetrics and Gynecology)",
    experienceYears: 10,
    bio: "Experienced women's health specialist focusing on pregnancy and gynecological care.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0012",
  },

  // 7. Psychiatry
  {
    name: "Dr. Nafis Ahmed",
    email: "nafis.ahmed@healthcare.test",
    address: "Gulshan, Dhaka",
    specialization: "Psychiatry",
    licenseNumber: "DEMO-BMD-0013",
    qualifications: "MBBS, MD (Psychiatry)",
    experienceYears: 9,
    bio: "Psychiatrist specializing in mental health and emotional wellbeing.",
    consultationFee: 1200.0,
    contactNumber: "DEMO-CONTACT-0013",
  },
  {
    name: "Dr. Tania Sultana",
    email: "tania.sultana@healthcare.test",
    address: "Rajshahi Sadar, Rajshahi",
    specialization: "Psychiatry",
    licenseNumber: "DEMO-BMD-0014",
    qualifications: "MBBS, FCPS (Psychiatry)",
    experienceYears: 12,
    bio: "Mental health specialist focusing on anxiety, depression and psychiatric care.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0014",
  },

  // 8. General Medicine
  {
    name: "Dr. Rakib Hasan",
    email: "rakib.hasan@healthcare.test",
    address: "Bogura Sadar, Bogura",
    specialization: "General Medicine",
    licenseNumber: "DEMO-BMD-0015",
    qualifications: "MBBS, FCPS (Medicine)",
    experienceYears: 16,
    bio: "General medicine specialist experienced in diagnosing common adult illnesses.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0015",
  },
  {
    name: "Dr. Mst. Sabrina Akter",
    email: "sabrina.akter@healthcare.test",
    address: "Mirpur, Dhaka",
    specialization: "General Medicine",
    licenseNumber: "DEMO-BMD-0016",
    qualifications: "MBBS, MD (Internal Medicine)",
    experienceYears: 7,
    bio: "Physician specializing in general healthcare and internal medicine.",
    consultationFee: 700.0,
    contactNumber: "DEMO-CONTACT-0016",
  },

  // 9. ENT
  {
    name: "Dr. Saif Uddin",
    email: "saif.uddin@healthcare.test",
    address: "Uttara, Dhaka",
    specialization: "ENT",
    licenseNumber: "DEMO-BMD-0017",
    qualifications: "MBBS, MS (ENT)",
    experienceYears: 11,
    bio: "ENT specialist focusing on ear, nose and throat conditions.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0017",
  },
  {
    name: "Dr. Mim Akter",
    email: "mim.akter@healthcare.test",
    address: "Khulna Sadar, Khulna",
    specialization: "ENT",
    licenseNumber: "DEMO-BMD-0018",
    qualifications: "MBBS, FCPS (ENT)",
    experienceYears: 8,
    bio: "Specialist in hearing, sinus and throat-related disorders.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0018",
  },

  // 10. Ophthalmology
  {
    name: "Dr. Asif Mahmud",
    email: "asif.mahmud@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Ophthalmology",
    licenseNumber: "DEMO-BMD-0019",
    qualifications: "MBBS, MS (Ophthalmology)",
    experienceYears: 13,
    bio: "Eye specialist focusing on vision care and eye diseases.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0019",
  },
  {
    name: "Dr. Lamia Rahman",
    email: "lamia.rahman@healthcare.test",
    address: "Bogura Sadar, Bogura",
    specialization: "Ophthalmology",
    licenseNumber: "DEMO-BMD-0020",
    qualifications: "MBBS, FCPS (Ophthalmology)",
    experienceYears: 9,
    bio: "Ophthalmologist specializing in eye health and vision disorders.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0020",
  },

  // 11. Urology
  {
    name: "Dr. Nayeem Islam",
    email: "nayeem.islam@healthcare.test",
    address: "Gulshan, Dhaka",
    specialization: "Urology",
    licenseNumber: "DEMO-BMD-0021",
    qualifications: "MBBS, MS (Urology)",
    experienceYears: 12,
    bio: "Urologist specializing in urinary tract and kidney-related conditions.",
    consultationFee: 1100.0,
    contactNumber: "DEMO-CONTACT-0021",
  },
  {
    name: "Dr. Jannatul Ferdous",
    email: "jannatul.ferdous@healthcare.test",
    address: "Chattogram Sadar, Chattogram",
    specialization: "Urology",
    licenseNumber: "DEMO-BMD-0022",
    qualifications: "MBBS, FCPS (Urology)",
    experienceYears: 8,
    bio: "Urology specialist focusing on urinary system health.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0022",
  },

  // 12. Gastroenterology
  {
    name: "Dr. Faisal Karim",
    email: "faisal.karim@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Gastroenterology",
    licenseNumber: "DEMO-BMD-0023",
    qualifications: "MBBS, MD (Gastroenterology)",
    experienceYears: 14,
    bio: "Gastroenterologist specializing in digestive system and liver disorders.",
    consultationFee: 1200.0,
    contactNumber: "DEMO-CONTACT-0023",
  },
  {
    name: "Dr. Sharmin Nahar",
    email: "sharmin.nahar@healthcare.test",
    address: "Rajshahi Sadar, Rajshahi",
    specialization: "Gastroenterology",
    licenseNumber: "DEMO-BMD-0024",
    qualifications: "MBBS, FCPS (Gastroenterology)",
    experienceYears: 10,
    bio: "Digestive health specialist focusing on stomach and intestinal conditions.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0024",
  },

  // 13. Oncology
  {
    name: "Dr. Shakil Ahmed",
    email: "shakil.ahmed@healthcare.test",
    address: "Mohakhali, Dhaka",
    specialization: "Oncology",
    licenseNumber: "DEMO-BMD-0025",
    qualifications: "MBBS, MD (Medical Oncology)",
    experienceYears: 15,
    bio: "Oncology specialist focusing on cancer diagnosis and treatment planning.",
    consultationFee: 1500.0,
    contactNumber: "DEMO-CONTACT-0025",
  },
  {
    name: "Dr. Rafia Islam",
    email: "rafia.islam@healthcare.test",
    address: "Chattogram Sadar, Chattogram",
    specialization: "Oncology",
    licenseNumber: "DEMO-BMD-0026",
    qualifications: "MBBS, FCPS (Radiotherapy)",
    experienceYears: 9,
    bio: "Cancer care specialist with experience in oncology treatment.",
    consultationFee: 1300.0,
    contactNumber: "DEMO-CONTACT-0026",
  },

  // 14. Endocrinology
  {
    name: "Dr. Mehedi Hasan",
    email: "mehedi.hasan@healthcare.test",
    address: "Bashundhara, Dhaka",
    specialization: "Endocrinology",
    licenseNumber: "DEMO-BMD-0027",
    qualifications: "MBBS, MD (Endocrinology)",
    experienceYears: 11,
    bio: "Endocrinologist specializing in diabetes and hormonal disorders.",
    consultationFee: 1100.0,
    contactNumber: "DEMO-CONTACT-0027",
  },
  {
    name: "Dr. Sadia Afrin",
    email: "sadia.afrin@healthcare.test",
    address: "Sylhet Sadar, Sylhet",
    specialization: "Endocrinology",
    licenseNumber: "DEMO-BMD-0028",
    qualifications: "MBBS, FCPS (Endocrinology)",
    experienceYears: 8,
    bio: "Hormonal health specialist focusing on thyroid and metabolic disorders.",
    consultationFee: 900.0,
    contactNumber: "DEMO-CONTACT-0028",
  },

  // 15. Pulmonology
  {
    name: "Dr. Omar Faruk",
    email: "omar.faruk@healthcare.test",
    address: "Mohammadpur, Dhaka",
    specialization: "Pulmonology",
    licenseNumber: "DEMO-BMD-0029",
    qualifications: "MBBS, MD (Pulmonology)",
    experienceYears: 13,
    bio: "Pulmonologist specializing in asthma and respiratory diseases.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0029",
  },
  {
    name: "Dr. Anika Tasnim",
    email: "anika.tasnim@healthcare.test",
    address: "Bogura Sadar, Bogura",
    specialization: "Pulmonology",
    licenseNumber: "DEMO-BMD-0030",
    qualifications: "MBBS, DTCD, FCPS (Medicine)",
    experienceYears: 7,
    bio: "Respiratory specialist focusing on lung and breathing disorders.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0030",
  },

  // 16. Nephrology
  {
    name: "Dr. Rezaul Karim",
    email: "rezaul.karim@healthcare.test",
    address: "Shyamoli, Dhaka",
    specialization: "Nephrology",
    licenseNumber: "DEMO-BMD-0031",
    qualifications: "MBBS, MD (Nephrology)",
    experienceYears: 14,
    bio: "Nephrologist specializing in kidney diseases and renal health.",
    consultationFee: 1200.0,
    contactNumber: "DEMO-CONTACT-0031",
  },
  {
    name: "Dr. Mahiya Sultana",
    email: "mahiya.sultana@healthcare.test",
    address: "Khulna Sadar, Khulna",
    specialization: "Nephrology",
    licenseNumber: "DEMO-BMD-0032",
    qualifications: "MBBS, FCPS (Nephrology)",
    experienceYears: 9,
    bio: "Kidney specialist focusing on chronic kidney disease and renal care.",
    consultationFee: 1000.0,
    contactNumber: "DEMO-CONTACT-0032",
  },

  // 17. Dentistry
  {
    name: "Dr. Zubair Ahmed",
    email: "zubair.ahmed@healthcare.test",
    address: "Banani, Dhaka",
    specialization: "Dentistry",
    licenseNumber: "DEMO-BMD-0033",
    qualifications: "BDS, FCPS (Dental Surgery)",
    experienceYears: 10,
    bio: "Dental surgeon specializing in oral health and dental treatments.",
    consultationFee: 700.0,
    contactNumber: "DEMO-CONTACT-0033",
  },
  {
    name: "Dr. Tasnim Jahan",
    email: "tasnim.jahan@healthcare.test",
    address: "Bogura Sadar, Bogura",
    specialization: "Dentistry",
    licenseNumber: "DEMO-BMD-0034",
    qualifications: "BDS, MS (Conservative Dentistry)",
    experienceYears: 8,
    bio: "Dentist focusing on preventive dental care and oral hygiene.",
    consultationFee: 600.0,
    contactNumber: "DEMO-CONTACT-0034",
  },

  // 18. Physiotherapy
  {
    name: "Dr. Adnan Kabir",
    email: "adnan.kabir@healthcare.test",
    address: "Dhanmondi, Dhaka",
    specialization: "Physiotherapy",
    licenseNumber: "DEMO-BMD-0035",
    qualifications: "BPT, MPT (Musculoskeletal Physiotherapy)",
    experienceYears: 9,
    bio: "Physiotherapy specialist focusing on rehabilitation and physical recovery.",
    consultationFee: 800.0,
    contactNumber: "DEMO-CONTACT-0035",
  },
  {
    name: "Dr. Rima Akter",
    email: "rima.akter@healthcare.test",
    address: "Rajshahi Sadar, Rajshahi",
    specialization: "Physiotherapy",
    licenseNumber: "DEMO-BMD-0036",
    qualifications: "BPT, MPT (Neurological Physiotherapy)",
    experienceYears: 7,
    bio: "Physiotherapist specializing in mobility and rehabilitation programs.",
    consultationFee: 700.0,
    contactNumber: "DEMO-CONTACT-0036",
  },
];

// ==========================================
// SEED DOCTORS FUNCTION
// ==========================================

const seedDoctors = async () => {
  console.log("Starting Doctor Seeding...");

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  let createdCount = 0;
  let skippedCount = 0;

  for (const doctor of doctors) {
    try {
      // Check if email or license number already exists
      const existingDoctor = await prisma.doctor.findFirst({
        where: {
          OR: [
            { email: doctor.email },
            { licenseNumber: doctor.licenseNumber },
          ],
        },
      });

      const existingUser = await prisma.user.findUnique({
        where: { email: doctor.email },
      });

      if (existingDoctor || existingUser) {
        console.log(`Skipped (already exists): ${doctor.email}`);
        skippedCount++;
        continue;
      }

      // Create User and Doctor together
      await prisma.user.create({
        data: {
          name: doctor.name,
          email: doctor.email,
          password: hashedPassword,
          role: Role.DOCTOR,
          needPasswordChange: false,
          emailVerified: true,

          doctor: {
            create: {
              ...doctor,
              verificationStatus: DoctorVerificationStatus.APPROVED,
            },
          },
        },
      });

      console.log(`Created: ${doctor.name} (${doctor.email})`);
      createdCount++;
    } catch (error) {
      console.error(`Failed to create ${doctor.email}:`, error);
    }
  }

  console.log("\n========== DOCTOR SEED SUMMARY ==========");
  console.log(`Total doctors: ${doctors.length}`);
  console.log(`Created: ${createdCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Failed: ${doctors.length - createdCount - skippedCount}`);
  console.log("=========================================");
};

// ==========================================
// RUN SEED
// ==========================================

seedDoctors()
  .catch((error) => {
    console.error("Doctor seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
