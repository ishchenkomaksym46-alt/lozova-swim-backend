/*
  Warnings:

  - You are about to drop the column `lane` on the `heats` table. All the data in the column will be lost.
  - Added the required column `lane` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "heats" DROP COLUMN "lane";

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "lane" INTEGER NOT NULL;
