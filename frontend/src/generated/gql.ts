import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query people {\n    people {\n      id\n      name\n      dogStatus\n      team {\n    id\n    name\n    }\n    }\n  }\n": typeof types.PeopleDocument,
    "\nmutation putPerson($id: ID, $name: String!, $dogStatus: DogStatus!) {\n  putPerson(id: $id, name: $name, dogStatus: $dogStatus) {\n    id\n    name\n    dogStatus\n    team {\n    id\n    name\n    }\n  }\n}\n": typeof types.PutPersonDocument,
    "\n  mutation deletePerson($id: ID!) {\n    deletePerson(id: $id) {\n      id\n    }\n  }\n  ": typeof types.DeletePersonDocument,
    "\n  mutation setTeam($userId: ID!, $teamId: ID!) {\n    setTeam(userId: $userId, teamId: $teamId) {\n      id\n      name\n      dogStatus\n      team {\n      id\n      name\n      }\n    }\n  }\n  ": typeof types.SetTeamDocument,
    "\n  query teams {\n    teams {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n": typeof types.TeamsDocument,
    "\n  mutation putTeam($id: ID, $name: String!) {\n    putTeam(id: $id, name: $name) {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n  ": typeof types.PutTeamDocument,
};
const documents: Documents = {
    "\n  query people {\n    people {\n      id\n      name\n      dogStatus\n      team {\n    id\n    name\n    }\n    }\n  }\n": types.PeopleDocument,
    "\nmutation putPerson($id: ID, $name: String!, $dogStatus: DogStatus!) {\n  putPerson(id: $id, name: $name, dogStatus: $dogStatus) {\n    id\n    name\n    dogStatus\n    team {\n    id\n    name\n    }\n  }\n}\n": types.PutPersonDocument,
    "\n  mutation deletePerson($id: ID!) {\n    deletePerson(id: $id) {\n      id\n    }\n  }\n  ": types.DeletePersonDocument,
    "\n  mutation setTeam($userId: ID!, $teamId: ID!) {\n    setTeam(userId: $userId, teamId: $teamId) {\n      id\n      name\n      dogStatus\n      team {\n      id\n      name\n      }\n    }\n  }\n  ": types.SetTeamDocument,
    "\n  query teams {\n    teams {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n": types.TeamsDocument,
    "\n  mutation putTeam($id: ID, $name: String!) {\n    putTeam(id: $id, name: $name) {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n  ": types.PutTeamDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query people {\n    people {\n      id\n      name\n      dogStatus\n      team {\n    id\n    name\n    }\n    }\n  }\n"): (typeof documents)["\n  query people {\n    people {\n      id\n      name\n      dogStatus\n      team {\n    id\n    name\n    }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation putPerson($id: ID, $name: String!, $dogStatus: DogStatus!) {\n  putPerson(id: $id, name: $name, dogStatus: $dogStatus) {\n    id\n    name\n    dogStatus\n    team {\n    id\n    name\n    }\n  }\n}\n"): (typeof documents)["\nmutation putPerson($id: ID, $name: String!, $dogStatus: DogStatus!) {\n  putPerson(id: $id, name: $name, dogStatus: $dogStatus) {\n    id\n    name\n    dogStatus\n    team {\n    id\n    name\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePerson($id: ID!) {\n    deletePerson(id: $id) {\n      id\n    }\n  }\n  "): (typeof documents)["\n  mutation deletePerson($id: ID!) {\n    deletePerson(id: $id) {\n      id\n    }\n  }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setTeam($userId: ID!, $teamId: ID!) {\n    setTeam(userId: $userId, teamId: $teamId) {\n      id\n      name\n      dogStatus\n      team {\n      id\n      name\n      }\n    }\n  }\n  "): (typeof documents)["\n  mutation setTeam($userId: ID!, $teamId: ID!) {\n    setTeam(userId: $userId, teamId: $teamId) {\n      id\n      name\n      dogStatus\n      team {\n      id\n      name\n      }\n    }\n  }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query teams {\n    teams {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query teams {\n    teams {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation putTeam($id: ID, $name: String!) {\n    putTeam(id: $id, name: $name) {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n  "): (typeof documents)["\n  mutation putTeam($id: ID, $name: String!) {\n    putTeam(id: $id, name: $name) {\n      id\n      name\n      members {\n        id\n        name\n      }\n    }\n  }\n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;