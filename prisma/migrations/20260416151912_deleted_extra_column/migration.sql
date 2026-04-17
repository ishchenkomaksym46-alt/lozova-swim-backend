/*
  Warnings:

  - You are about to drop the column `swimmer_id` on the `distances` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "distances" DROP CONSTRAINT "distances_swimmer_id_fkey";

-- AlterTable
ALTER TABLE "distances" DROP COLUMN "swimmer_id";
