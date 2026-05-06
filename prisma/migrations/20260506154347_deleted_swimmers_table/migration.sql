/*
  Warnings:

  - You are about to drop the `swimmers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "swimmers" DROP CONSTRAINT "swimmers_competition_id_fkey";

-- DropTable
DROP TABLE "swimmers";
