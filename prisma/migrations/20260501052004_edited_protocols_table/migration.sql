/*
  Warnings:

  - You are about to drop the column `file_name` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `text_content` on the `protocols` table. All the data in the column will be lost.
  - Added the required column `header` to the `protocols` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `protocols` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "protocols" DROP COLUMN "file_name",
DROP COLUMN "file_url",
DROP COLUMN "text_content",
ADD COLUMN     "header" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
