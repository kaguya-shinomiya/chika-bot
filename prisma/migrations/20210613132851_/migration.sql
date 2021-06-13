-- CreateEnum
CREATE TYPE "CmdCategory" AS ENUM ('CURRENCY', 'FUN', 'GAMES', 'MUSIC', 'UTILITY');

-- CreateTable
CREATE TABLE "Arg" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "optional" BOOLEAN NOT NULL,
    "multi" BOOLEAN NOT NULL,
    "commandId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "CmdCategory" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Command.name_unique" ON "Command"("name");

-- AddForeignKey
ALTER TABLE "Arg" ADD FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE SET NULL ON UPDATE CASCADE;
