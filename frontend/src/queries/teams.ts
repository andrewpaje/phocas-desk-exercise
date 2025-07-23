import { graphql } from '../generated';

export const TEAM_QUERY = graphql(`
  query teams {
    teams {
      id
      name
      members {
        id
        name
      }
    }
  }
`);

export const PUT_TEAM = graphql(`
  mutation putTeam($id: ID, $name: String!) {
    putTeam(id: $id, name: $name) {
      id
      name
      members {
        id
        name
      }
    }
  }
  `);

export const DELETE_TEAM = graphql(`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
  `);
