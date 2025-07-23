import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { PEOPLE_QUERY, SET_TEAM } from '../queries/people';
import { DELETE_TEAM, PUT_TEAM, TEAM_QUERY } from '../queries/teams';

export default function TeamsPage() {
  const [newTeam, setNewTeam] = useState<string>('');
  const client = useApolloClient();

  const { loading, error, data } = useQuery(TEAM_QUERY);
  const { loading: loadingPeople, error: errorPeople, data: _dataPeople } = useQuery(TEAM_QUERY);

  const [putTeam] = useMutation(PUT_TEAM, {
    update(cache, { data }, { variables }) {
      let teams = cache.readQuery({ query: TEAM_QUERY })?.teams;
      if (!data || !teams) {
        return;
      }
      if (variables?.id) {
        teams = teams.map((team) => (team.id === data.putTeam.id ? data.putTeam : team));
      } else {
        teams = [...teams, data.putTeam];
      }
      cache.writeQuery({
        query: TEAM_QUERY,
        data: { teams },
      });
    },
  });

  const [deleteTeam] = useMutation(DELETE_TEAM, {
    update(cache, { data }) {
      if (data?.deleteTeam) {
        const team = cache.identify(data.deleteTeam);
        cache.evict({ id: team });
      }
    },
  });

  const [setTeam] = useMutation(SET_TEAM, {
    update(cache, { data }) {
      let teams = cache.readQuery({ query: TEAM_QUERY })?.teams;
      if (!data || !teams) {
        return;
      }

      teams = teams.map((team) => {
        const memberIsCurrentlyInThisTeam = team.members.some(
          (member: { id: string; name: string }) => member.id === data.setTeam.id,
        );

        if (memberIsCurrentlyInThisTeam) {
          const newMembers = team.members.filter(
            (member: { id: string; name: string }) => member.id !== data.setTeam.id,
          );

          return {
            ...team,
            members: newMembers,
          };
        }

        return team;
      });

      cache.writeQuery({
        query: TEAM_QUERY,
        data: { teams },
      });

      // Update the people list as well
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

  if (loading || loadingPeople) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (errorPeople) return <p>Error : {errorPeople.message}</p>;

  const handleAddTeam = async () => {
    if (newTeam.trim()) {
      await putTeam({ variables: { name: newTeam } });
      setNewTeam('');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    await deleteTeam({ variables: { id: teamId } });
  };

  const handleDeleteMember = async (userId: string) => {
    await setTeam({ variables: { userId, teamId: 'none' } });
  };

  const handleEditTeamChange = (teamId: string, name: string) => {
    let teams = data?.teams;
    if (!teams) {
      return;
    }

    teams = teams.map((p) => (p.id === teamId ? { ...p, name } : p));

    client.cache.writeQuery({
      query: TEAM_QUERY,
      data: { teams },
    });
  };

  const handleSaveEdit = async (teamId: string) => {
    const team = data?.teams.find((team) => team.id === teamId);
    if (team) {
      await putTeam({ variables: { id: teamId, name: team.name } });
    }
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>People</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <TextField
                    value={team.name}
                    data-testid='name'
                    onChange={(e) => handleEditTeamChange(team.id, e.target.value)}
                    onBlur={() => handleSaveEdit(team.id)}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={1} direction='row'>
                    {team.members.map((member) => (
                      <Chip
                        key={member.id}
                        label={member.name}
                        color='primary'
                        onDelete={() => handleDeleteMember(member.id)}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton
                    data-testid='delete'
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleDeleteTeam(team.id)}
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
          data-testid='addTeamName'
          label='Add Team'
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
        <IconButton
          data-testid='addTeamButton'
          onClick={handleAddTeam}
          aria-label='add'
          style={{ marginLeft: '8px' }}
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}
