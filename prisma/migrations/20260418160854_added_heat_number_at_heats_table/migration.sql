/*
  Warnings:

  - Added the required column `heat_number` to the `heats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "heats" ADD COLUMN     "heat_number" INTEGER NOT NULL;
