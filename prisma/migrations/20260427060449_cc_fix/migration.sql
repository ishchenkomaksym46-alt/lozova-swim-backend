/*
  Warnings:

  - You are about to drop the column `age_group_id` on the `heats` table. All the data in the column will be lost.
  - You are about to drop the `age_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `applications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "age_groups" DROP CONSTRAINT "age_groups_distance_id_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_age_group_id_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_distance_id_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_participant_id_fkey";

-- AlterTable
ALTER TABLE "heats" DROP COLUMN "age_group_id";

-- DropTable
DROP TABLE "age_groups";

-- DropTable
DROP TABLE "applications";
