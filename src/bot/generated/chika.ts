import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Argument = {
  __typename?: 'Argument';
  command: Command;
  id: Scalars['ID'];
  multi?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  optional?: Maybe<Scalars['Boolean']>;
};

export type Command = {
  __typename?: 'Command';
  aliases?: Maybe<Array<Scalars['String']>>;
  args?: Maybe<Array<Argument>>;
  category: CommandCategory;
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export enum CommandCategory {
  Currency = 'CURRENCY',
  Fun = 'FUN',
  Games = 'GAMES',
  Music = 'MUSIC',
  Utility = 'UTILITY',
}

export type CreateArgumentInput = {
  multi?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  optional?: Maybe<Scalars['Boolean']>;
};

export type CreateCommandInput = {
  aliases?: Maybe<Array<Scalars['String']>>;
  args?: Maybe<Array<CreateArgumentInput>>;
  category: CommandCategory;
  description: Scalars['String'];
  name: Scalars['String'];
};

export type CreateGuildInput = {
  customPrefix?: Maybe<Scalars['String']>;
  /** The commands to disable in this server. */
  disabledCommands?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
};

export type Guild = {
  __typename?: 'Guild';
  customPrefix?: Maybe<Scalars['String']>;
  /** Array of commands disabled in this server. */
  disabledCommands?: Maybe<Array<Command>>;
  id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates one to many commands. */
  createCommand: Array<Command>;
  createGuild: Guild;
  dropCommands?: Maybe<Scalars['Int']>;
  removeGuild: Guild;
  seedCommands?: Maybe<Scalars['Int']>;
  updateGuild: Guild;
};

export type MutationCreateCommandArgs = {
  commands: Array<CreateCommandInput>;
};

export type MutationCreateGuildArgs = {
  createGuildInput: CreateGuildInput;
};

export type MutationRemoveGuildArgs = {
  id: Scalars['String'];
};

export type MutationSeedCommandsArgs = {
  commands: Array<CreateCommandInput>;
};

export type MutationUpdateGuildArgs = {
  updateGuildInput: UpdateGuildInput;
};

export type Query = {
  __typename?: 'Query';
  command: Command;
  commands: Array<Command>;
  guild: Guild;
};

export type QueryCommandArgs = {
  name: Scalars['String'];
};

export type QueryGuildArgs = {
  id: Scalars['String'];
};

export type UpdateGuildInput = {
  customPrefix?: Maybe<Scalars['String']>;
  /** The commands to disable in this server. */
  disabledCommands?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
};

export type SeedCommandsMutationVariables = Exact<{
  commands: Array<CreateCommandInput> | CreateCommandInput;
}>;

export type SeedCommandsMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'seedCommands'
>;

export const SeedCommandsDocument = gql`
  mutation seedCommands($commands: [CreateCommandInput!]!) {
    seedCommands(commands: $commands)
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    seedCommands(
      variables: SeedCommandsMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<SeedCommandsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SeedCommandsMutation>(
            SeedCommandsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'seedCommands',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
