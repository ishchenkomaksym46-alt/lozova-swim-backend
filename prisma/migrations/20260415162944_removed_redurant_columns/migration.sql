/*
  Warnings:

  - You are about to drop the column `distances_id` on the `participants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_distances_id_fkey";

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "distances_id";
