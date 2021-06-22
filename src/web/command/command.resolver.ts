import { Query, Resolver } from '@nestjs/graphql';
import { CommandService } from './command.service';
import { Command } from './entities/command.entity';

@Resolver(() => Command)
export class CommandResolver {
  constructor(private readonly commandService: CommandService) {}

  @Query(() => [Command])
  getAllCommands() {
    return this.commandService.findAll();
  }
}
