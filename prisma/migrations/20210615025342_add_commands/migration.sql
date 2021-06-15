/*
  Warnings:

  - Made the column `commandId` on table `Arg` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Arg" ALTER COLUMN "commandId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "aliases" TEXT[];

-- AlterTable
ALTER TABLE "Shiritori" ADD COLUMN     "minLen" INTEGER;
