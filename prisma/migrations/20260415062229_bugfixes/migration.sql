/*
  Warnings:

  - Added the required column `competitor_id` to the `distances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `swimmers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "distances" ADD COLUMN     "competitor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "swimmers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "competitors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "distances" ADD CONSTRAINT "distances_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
