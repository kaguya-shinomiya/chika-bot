-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ribbons" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "prefix" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shiritori" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "handSize" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balloon" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "minVol" INTEGER NOT NULL,
    "maxVol" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.userId_unique" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild.guildId_unique" ON "Guild"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Shiritori.guildId_unique" ON "Shiritori"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Balloon.guildId_unique" ON "Balloon"("guildId");

-- AddForeignKey
ALTER TABLE "Shiritori" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balloon" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
