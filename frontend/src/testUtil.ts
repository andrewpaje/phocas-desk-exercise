import type { OperationVariables } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Unmasked } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import type { calculateDeskLayout } from './calculateDeskLayout';
import type { DogStatus } from './generated/graphql';

let idCounter = 0;

type Person = ReturnType<typeof calculateDeskLayout>[0];

export const testPersonBuilder = (team: string, DogStatus: DogStatus): Person => {
  const id = String(idCounter++);
  return {
    id,
    name: id,
    dogStatus: DogStatus,
    team: {
      id: team,
      name: team,
    },
    __typename: 'Person',
  };
};

export function mock<TData extends Record<string, unknown>, TVariables extends OperationVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  data: Unmasked<TData>,
): MockedResponse<TData, TVariables> {
  const toReturn: MockedResponse<TData, TVariables> = {
    request: {
      query,
      variables,
    },
    result: {
      data,
    },
  };
  return toReturn;
}
