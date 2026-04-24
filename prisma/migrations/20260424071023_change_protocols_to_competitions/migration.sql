-- Видаляємо старий foreign key
ALTER TABLE "protocols" DROP CONSTRAINT "protocols_distance_id_fkey";

-- Видаляємо стару колонку
ALTER TABLE "protocols" DROP COLUMN "distance_id";

-- Додаємо нову колонку
ALTER TABLE "protocols" ADD COLUMN "competition_id" INTEGER NOT NULL DEFAULT 1;

-- Додаємо новий foreign key
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
