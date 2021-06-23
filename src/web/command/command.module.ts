import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandResolver } from './command.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [CommandResolver, CommandService, PrismaService],
})
export class CommandModule {}
