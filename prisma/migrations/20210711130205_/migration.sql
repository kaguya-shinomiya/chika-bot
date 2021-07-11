/*
  Warnings:

  - You are about to drop the `_CommandToGuild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommandToGuild" DROP CONSTRAINT "_CommandToGuild_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommandToGuild" DROP CONSTRAINT "_CommandToGuild_B_fkey";

-- DropTable
DROP TABLE "_CommandToGuild";
