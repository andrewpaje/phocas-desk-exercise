import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  NativeSelect,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { DogStatus } from '../generated/graphql';
import { DELETE_PERSON, PEOPLE_QUERY, PUT_PERSON, SET_TEAM } from '../queries/people';
import { TEAM_QUERY } from '../queries/teams';

export default function PeoplePage() {
  const [newUser, setNewUser] = useState<string>('');
  const [newUserDogStatus, setNewUserDogStatus] = useState<DogStatus>(DogStatus.Like);
  const client = useApolloClient();

  const { loading, error, data } = useQuery(PEOPLE_QUERY);

  const { loading: loadingTeams, error: errorTeams, data: dataTeams } = useQuery(TEAM_QUERY);

  const [putPerson, putData] = useMutation(PUT_PERSON, {
    update(cache, { data }, { variables }) {
      let people = cache.readQuery({ query: PEOPLE_QUERY })?.people;
      if (!data || !people) {
        return;
      }
      if (variables?.id) {
        people = people.map((person) =>
          person.id === data.putPerson.id ? data.putPerson : person,
        );
      } else {
        people = [...people, data.putPerson];
      }
      cache.writeQuery({
        query: PEOPLE_QUERY,
        data: { people },
      });
    },
  });

  const [setTeam] = useMutation(SET_TEAM, {
    update(cache, { data }) {
      let people = cache.readQuery({ query: PEOPLE_QUERY })?.people;
      if (!data || !people) {
        return;
      }

      people = people.map((person) => (person.id === data.setTeam.id ? data.setTeam : person));

      cache.writeQuery({
        query: PEOPLE_QUERY,
        data: { people },
      });
    },
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data }) {
      if (data?.deletePerson) {
        const person = cache.identify(data.deletePerson);
        cache.evict({ id: person });
      }
    },
  });

  if (loading || loadingTeams) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (putData.error) return <p>Error : {putData.error.message}</p>;
  if (errorTeams) return <p>Error : {errorTeams.message}</p>;

  const handleAddUser = async () => {
    if (newUser.trim()) {
      await putPerson({ variables: { name: newUser, dogStatus: newUserDogStatus } });
      setNewUser('');
      setNewUserDogStatus(DogStatus.Like);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deletePerson({ variables: { id: userId } });
  };

  const handleEditUserChange = (userId: string, name: string, dogStatus: DogStatus) => {
    const people = data?.people;
    if (!people) {
      return;
    }
    const person = people.find((p) => p.id === userId);
    if (person) {
      client.cache.modify({
        id: client.cache.identify(person),
        fields: {
          name: () => name,
          dogStatus: () => dogStatus,
        },
      });
    }
  };

  const handleEditUserTeam = async (userId: string, teamId: string) => {
    await setTeam({ variables: { userId, teamId } });
  };

  const handleSaveEdit = async (userId: string) => {
    const person = data?.people.find((user) => user.id === userId);
    if (person) {
      await putPerson({
        variables: { id: userId, name: person.name, dogStatus: person.dogStatus },
      });
    }
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Dog Status</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.people.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <TextField
                    data-testid='name'
                    value={user.name}
                    onChange={(e) => handleEditUserChange(user.id, e.target.value, user.dogStatus)}
                    onBlur={() => handleSaveEdit(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <NativeSelect
                    data-testid='dogStatus'
                    value={user.dogStatus}
                    onChange={(e) =>
                      handleEditUserChange(user.id, user.name, e.target.value as DogStatus)
                    }
                    onBlur={() => handleSaveEdit(user.id)}
                  >
                    <option value={DogStatus.Like}>Like</option>
                    <option value={DogStatus.Avoid}>Avoid</option>
                    <option value={DogStatus.Have}>Have</option>
                  </NativeSelect>
                </TableCell>
                <TableCell>
                  <NativeSelect
                    data-testid='team'
                    value={user.team?.id || 'none'}
                    onChange={(e) => handleEditUserTeam(user.id, e.target.value)}
                  >
                    <option value='none'>None</option>
                    {dataTeams?.teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </NativeSelect>
                </TableCell>

                <TableCell>
                  <IconButton
                    data-testid='delete'
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '16px' }}>
        <TextField
          label='Add User'
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          data-testid='addUserName'
        />
        <NativeSelect
          value={newUserDogStatus}
          onChange={(e) => setNewUserDogStatus(e.target.value as DogStatus)}
          style={{ marginLeft: '8px' }}
          data-testid='addUserDogStatus'
        >
          <option value={DogStatus.Like}>Like</option>
          <option value={DogStatus.Avoid}>Avoid</option>
          <option value={DogStatus.Have}>Have</option>
        </NativeSelect>
        <IconButton
          onClick={handleAddUser}
          aria-label='add'
          style={{ marginLeft: '8px' }}
          data-testid='addUserButton'
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}
