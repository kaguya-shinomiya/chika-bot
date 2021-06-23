import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CmdCategory } from '@prisma/client';
import { Argument } from './argument.entity';

registerEnumType(CmdCategory, { name: 'CommandCategory' });

@ObjectType()
export class Command {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => CmdCategory)
  category!: CmdCategory;

  @Field(() => [String], { nullable: true })
  aliases?: string[];

  @Field(() => [Argument], { nullable: true })
  args?: Argument[];
}
