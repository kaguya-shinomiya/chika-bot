import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";
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
  __typename?: "Argument";
  command: Command;
  id: Scalars["ID"];
  multi?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  optional?: Maybe<Scalars["Boolean"]>;
};

export type Command = {
  __typename?: "Command";
  aliases?: Maybe<Array<Scalars["String"]>>;
  args?: Maybe<Array<Argument>>;
  category: CommandCategory;
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
};

export enum CommandCategory {
  Currency = "CURRENCY",
  Fun = "FUN",
  Games = "GAMES",
  Music = "MUSIC",
  Utility = "UTILITY",
}

export type CreateArgumentInput = {
  multi?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  optional?: Maybe<Scalars["Boolean"]>;
};

export type CreateCommandInput = {
  aliases?: Maybe<Array<Scalars["String"]>>;
  args?: Maybe<Array<CreateArgumentInput>>;
  category: CommandCategory;
  description: Scalars["String"];
  name: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createCommand: Scalars["Int"];
  dropCommands?: Maybe<Scalars["Int"]>;
};

export type MutationCreateCommandArgs = {
  createCommandInput: Array<CreateCommandInput>;
};

export type Query = {
  __typename?: "Query";
  command: Command;
  commands: Array<Command>;
};

export type QueryCommandArgs = {
  name: Scalars["String"];
};

export type CreateCommandsMutationVariables = Exact<{
  commands: Array<CreateCommandInput> | CreateCommandInput;
}>;

export type CreateCommandsMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "createCommand"
>;

export type DropCommandsMutationVariables = Exact<{ [key: string]: never }>;

export type DropCommandsMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "dropCommands"
>;

export const CreateCommandsDocument = gql`
  mutation createCommands($commands: [CreateCommandInput!]!) {
    createCommand(createCommandInput: $commands)
  }
`;
export const DropCommandsDocument = gql`
  mutation dropCommands {
    dropCommands
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    createCommands(
      variables: CreateCommandsMutationVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<CreateCommandsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateCommandsMutation>(
            CreateCommandsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "createCommands"
      );
    },
    dropCommands(
      variables?: DropCommandsMutationVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<DropCommandsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DropCommandsMutation>(
            DropCommandsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "dropCommands"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
