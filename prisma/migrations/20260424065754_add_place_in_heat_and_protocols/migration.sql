/*
  Warnings:

  - Added the required column `place_in_heat` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "results" ADD COLUMN "place_in_heat" INTEGER NOT NULL DEFAULT 999;

-- CreateTable
CREATE TABLE "protocols" (
    "id" SERIAL NOT NULL,
    "distance_id" INTEGER NOT NULL,
    "file_name" TEXT,
    "file_url" TEXT,
    "text_content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocols_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
