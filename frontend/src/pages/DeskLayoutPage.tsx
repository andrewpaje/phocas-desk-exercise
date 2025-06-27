import { useQuery } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { calculateDeskLayout } from '../calculateDeskLayout';
import { PEOPLE_QUERY } from '../queries/people';

export default function LayoutPage() {
  const { loading: loadingUsers, error: errorsUsers, data: dataUsers } = useQuery(PEOPLE_QUERY);

  if (loadingUsers) return <p>Loading...</p>;
  if (errorsUsers) return <p>Error : {errorsUsers.message}</p>;

  const people = calculateDeskLayout(dataUsers?.people ?? []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Dog Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.team?.name ?? 'None'}</TableCell>
              <TableCell>{person.dogStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
