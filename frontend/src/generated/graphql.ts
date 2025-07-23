/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Instant: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
};

export enum DogStatus {
  Avoid = 'AVOID',
  Have = 'HAVE',
  Like = 'LIKE'
}

export type Mutations = {
  __typename?: 'Mutations';
  deletePerson: Person;
  deleteTeam: Team;
  putPerson: Person;
  putTeam: Team;
  setTeam: Person;
};


export type MutationsDeletePersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteTeamArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsPutPersonArgs = {
  dogStatus: DogStatus;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};


export type MutationsPutTeamArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};


export type MutationsSetTeamArgs = {
  teamId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Person = {
  __typename?: 'Person';
  createdAt: Scalars['Instant']['output'];
  dogStatus: DogStatus;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  revision: Scalars['Long']['output'];
  team?: Maybe<Team>;
  updatedAt: Scalars['Instant']['output'];
};

export type Query = {
  __typename?: 'Query';
  people: Array<Person>;
  teams: Array<Team>;
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['Instant']['output'];
  id: Scalars['ID']['output'];
  members: Array<Person>;
  name: Scalars['String']['output'];
  revision: Scalars['Long']['output'];
  updatedAt: Scalars['Instant']['output'];
};

export type PeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type PeopleQuery = { __typename?: 'Query', people: Array<{ __typename?: 'Person', id: string, name: string, dogStatus: DogStatus, team?: { __typename?: 'Team', id: string, name: string } | null }> };

export type PutPersonMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  dogStatus: DogStatus;
}>;


export type PutPersonMutation = { __typename?: 'Mutations', putPerson: { __typename?: 'Person', id: string, name: string, dogStatus: DogStatus, team?: { __typename?: 'Team', id: string, name: string } | null } };

export type DeletePersonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePersonMutation = { __typename?: 'Mutations', deletePerson: { __typename?: 'Person', id: string } };

export type SetTeamMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  teamId: Scalars['ID']['input'];
}>;


export type SetTeamMutation = { __typename?: 'Mutations', setTeam: { __typename?: 'Person', id: string, name: string, dogStatus: DogStatus, team?: { __typename?: 'Team', id: string, name: string } | null } };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, members: Array<{ __typename?: 'Person', id: string, name: string }> }> };

export type PutTeamMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
}>;


export type PutTeamMutation = { __typename?: 'Mutations', putTeam: { __typename?: 'Team', id: string, name: string, members: Array<{ __typename?: 'Person', id: string, name: string }> } };

export type DeleteTeamMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutations', deleteTeam: { __typename?: 'Team', id: string } };


export const PeopleDocument = {"__meta__":{"hash":"0837c4e231054d45f5d731789a16baeec4145130"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"people"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"people"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dogStatus"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PeopleQuery, PeopleQueryVariables>;
export const PutPersonDocument = {"__meta__":{"hash":"2fe4b24fa1a8acc08df8e0320e5df606c183d316"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"putPerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dogStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DogStatus"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"putPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"dogStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dogStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dogStatus"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PutPersonMutation, PutPersonMutationVariables>;
export const DeletePersonDocument = {"__meta__":{"hash":"d06faa08dda76e4e607a14fea136fec5a3aee072"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePersonMutation, DeletePersonMutationVariables>;
export const SetTeamDocument = {"__meta__":{"hash":"362e973d94c6dda546f11e78e95621b997e1d11d"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dogStatus"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SetTeamMutation, SetTeamMutationVariables>;
export const TeamsDocument = {"__meta__":{"hash":"8d815dec577623ab1ef62c59ce4d338e9012ee94"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const PutTeamDocument = {"__meta__":{"hash":"63d9c01b5a7e611c70fba6895792bafd067850ff"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"putTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"putTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PutTeamMutation, PutTeamMutationVariables>;
export const DeleteTeamDocument = {"__meta__":{"hash":"d6637cf742bbe6716a15b2b1538757acf8b56401"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;