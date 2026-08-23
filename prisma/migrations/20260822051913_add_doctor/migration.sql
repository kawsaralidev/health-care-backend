/*
  Warnings:

  - The values [CANCELED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETE');
ALTER TABLE "public"."appointments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "bio" TEXT,
    "consultationFee" DECIMAL(10,2),
    "contactNumber" TEXT,
    "verificationStatus" "DoctorVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "resume" TEXT,
    "resumePublicId" TEXT,
    "additionalFiles" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctors"("email");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
