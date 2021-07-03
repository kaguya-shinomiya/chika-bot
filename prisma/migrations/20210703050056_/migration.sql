-- DropForeignKey
ALTER TABLE "Arg" DROP CONSTRAINT "Arg_commandId_fkey";

-- AddForeignKey
ALTER TABLE "Arg" ADD FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;
