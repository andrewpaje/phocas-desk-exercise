import { graphql } from '../generated';

export const PEOPLE_QUERY = graphql(`
  query people {
    people {
      id
      name
      dogStatus
      team {
    id
    name
    }
    }
  }
`);

export const PUT_PERSON = graphql(`
mutation putPerson($id: ID, $name: String!, $dogStatus: DogStatus!) {
  putPerson(id: $id, name: $name, dogStatus: $dogStatus) {
    id
    name
    dogStatus
    team {
    id
    name
    }
  }
}
`);

export const DELETE_PERSON = graphql(`
  mutation deletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
  `);

export const SET_TEAM = graphql(`
  mutation setTeam($userId: ID!, $teamId: ID!) {
    setTeam(userId: $userId, teamId: $teamId) {
      id
      name
      dogStatus
      team {
      id
      name
      }
    }
  }
  `);
