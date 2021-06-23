-- CreateTable
CREATE TABLE "_CommandToGuild" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommandToGuild_AB_unique" ON "_CommandToGuild"("A", "B");

-- CreateIndex
CREATE INDEX "_CommandToGuild_B_index" ON "_CommandToGuild"("B");

-- AddForeignKey
ALTER TABLE "_CommandToGuild" ADD FOREIGN KEY ("A") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommandToGuild" ADD FOREIGN KEY ("B") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
