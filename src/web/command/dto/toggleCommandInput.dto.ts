import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ToggleCommandInput {
  @Field(() => String)
  guildId!: string;

  @Field(() => ID)
  commandId!: number;
}
