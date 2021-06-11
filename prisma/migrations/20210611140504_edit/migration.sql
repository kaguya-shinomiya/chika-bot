-- DropForeignKey
ALTER TABLE "Balloon" DROP CONSTRAINT "Balloon_guildId_fkey";

-- DropForeignKey
ALTER TABLE "Shiritori" DROP CONSTRAINT "Shiritori_guildId_fkey";

-- AlterTable
ALTER TABLE "Balloon" ALTER COLUMN "guildId" SET DATA TYPE TEXT,
ALTER COLUMN "minVol" DROP NOT NULL,
ALTER COLUMN "maxVol" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Shiritori" ALTER COLUMN "guildId" SET DATA TYPE TEXT,
ALTER COLUMN "handSize" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shiritori" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balloon" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;
