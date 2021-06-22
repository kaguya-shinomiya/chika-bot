import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CommandService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.command.findMany({ include: { args: true } });
  }
}
