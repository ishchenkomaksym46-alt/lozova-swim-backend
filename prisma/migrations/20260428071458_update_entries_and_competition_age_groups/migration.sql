/*
  Warnings:

  - You are about to drop the column `age_group` on the `entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "age_groups" TEXT NOT NULL DEFAULT '10 і молодше,11-12,13-14,15-16,17-18,19+';

-- AlterTable
ALTER TABLE "entries" DROP COLUMN "age_group";
