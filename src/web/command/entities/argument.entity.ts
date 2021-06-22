import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Command } from './command.entity';

@ObjectType()
export class Argument {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  optional!: boolean;

  @Field(() => Command)
  command!: Command;
}
