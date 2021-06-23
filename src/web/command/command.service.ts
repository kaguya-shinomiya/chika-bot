import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { ToggleCommandInput } from './dto/toggleCommandInput.dto';

@Injectable()
export class CommandService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.command.findMany({ include: { args: true } });
  }

  enable(toggleCommandInput: ToggleCommandInput) {
    const { guildId, commandId } = toggleCommandInput;
    return this.prisma.guild.update({
      where: { guildId },
      data: { disabledCommands: { connect: { id: commandId } } },
    });
  }

  disable(toggleCommandInput: ToggleCommandInput) {
    const { guildId, commandId } = toggleCommandInput;
    return this.prisma.guild.update({
      where: { guildId },
      data: { disabledCommands: { disconnect: { id: commandId } } },
    });
  }
}
