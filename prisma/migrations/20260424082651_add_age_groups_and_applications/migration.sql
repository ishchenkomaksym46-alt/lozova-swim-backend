/*
  Warnings:

  - Added the required column `birth_year` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "heats" ADD COLUMN     "age_group_id" INTEGER;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "birth_year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "protocols" ALTER COLUMN "competition_id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "age_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "min_year" INTEGER NOT NULL,
    "max_year" INTEGER NOT NULL,
    "distance_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "age_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_year" INTEGER NOT NULL,
    "declared_time" TEXT NOT NULL,
    "distance_id" INTEGER NOT NULL,
    "age_group_id" INTEGER,
    "is_assigned" BOOLEAN NOT NULL DEFAULT false,
    "participant_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_participant_id_key" ON "applications"("participant_id");

-- AddForeignKey
ALTER TABLE "age_groups" ADD CONSTRAINT "age_groups_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_age_group_id_fkey" FOREIGN KEY ("age_group_id") REFERENCES "age_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
