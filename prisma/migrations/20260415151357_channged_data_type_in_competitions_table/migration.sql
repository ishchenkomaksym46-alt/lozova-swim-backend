/*
  Warnings:

  - You are about to drop the column `competitor_id` on the `distances` table. All the data in the column will be lost.
  - You are about to drop the `competitors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "distances" DROP CONSTRAINT "distances_competitor_id_fkey";

-- AlterTable
ALTER TABLE "competitions" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "distances" DROP COLUMN "competitor_id";

-- DropTable
DROP TABLE "competitors";
