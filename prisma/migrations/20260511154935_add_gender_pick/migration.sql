-- CreateEnum
CREATE TYPE "EntryItemGender" AS ENUM ('WOMEN', 'MEN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('WOMEN', 'MEN');

-- AlterTable
ALTER TABLE "entry_items" ADD COLUMN     "gender" "EntryItemGender" NOT NULL DEFAULT 'WOMEN';

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'WOMEN';
