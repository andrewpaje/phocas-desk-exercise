import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TEAM_QUERY } from '../queries/teams';
import { mock } from '../testUtil';
import TeamsPage from './TeamsPage';

const mocks = [
  mock(
    TEAM_QUERY,
    {},
    {
      teams: [
        {
          id: '3',
          name: 'A team',
          members: [],
        },
        {
          id: '4',
          name: 'B team',
          members: [],
        },
      ],
    },
  ),
];

describe('TeamsPage', () => {
  it('renders list', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TeamsPage />
      </MockedProvider>,
    );

    const names = await screen.findAllByTestId('name');
    expect(names).toHaveLength(2);
    expect(names[0].querySelector('input')).toHaveValue('A team');
    expect(names[1].querySelector('input')).toHaveValue('B team');
  });
});
