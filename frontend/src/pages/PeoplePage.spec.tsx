import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DogStatus } from '../generated/graphql';
import { DELETE_PERSON, PEOPLE_QUERY, PUT_PERSON, SET_TEAM } from '../queries/people';
import { TEAM_QUERY } from '../queries/teams';
import { mock } from '../testUtil';
import PeoplePage from './PeoplePage';

const mocks = [
  mock(
    PEOPLE_QUERY,
    {},
    {
      people: [
        {
          id: '1',
          name: 'John',
          dogStatus: DogStatus.Like,
          team: {
            id: '3',
            name: 'A team',
          },
          __typename: 'Person',
        },
        {
          id: '2',
          name: 'Sam',
          dogStatus: DogStatus.Have,
          team: null,
          __typename: 'Person',
        },
      ],
    },
  ),
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
  mock(DELETE_PERSON, { id: '1' }, { deletePerson: { id: '1', __typename: 'Person' } }),
  mock(
    PUT_PERSON,
    { name: 'Bob', dogStatus: DogStatus.Have },
    {
      putPerson: {
        id: '4',
        __typename: 'Person',
        dogStatus: DogStatus.Have,
        name: 'Bob',
        team: null,
      },
    },
  ),
  mock(
    SET_TEAM,
    { userId: '2', teamId: '4' },
    {
      setTeam: {
        id: '2',
        name: 'Sam',
        dogStatus: DogStatus.Have,
        team: {
          id: '4',
          name: 'B team',
        },
        __typename: 'Person',
      },
    },
  ),
];

describe('PeoplePage', () => {
  it('renders list', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <PeoplePage />
      </MockedProvider>,
    );

    const names = await screen.findAllByTestId('name');
    expect(names).toHaveLength(2);
    expect(names[0].querySelector('input')).toHaveValue('John');
    expect(names[1].querySelector('input')).toHaveValue('Sam');

    const dogStatus = await screen.findAllByTestId('dogStatus');
    expect(dogStatus).toHaveLength(2);
    expect(dogStatus[0].querySelector('select')).toHaveValue('LIKE');
    expect(dogStatus[1].querySelector('select')).toHaveValue('HAVE');

    const team = await screen.findAllByTestId('team');
    expect(team).toHaveLength(2);
    expect(team[0].querySelector('select')).toHaveValue('3');
    expect(team[1].querySelector('select')).toHaveValue('none');
  });

  it('test delete', async () => {
    const container = render(
      <MockedProvider mocks={mocks}>
        <PeoplePage />
      </MockedProvider>,
    );

    const deletes = await container.findAllByTestId('delete');
    expect(deletes).toHaveLength(2);

    const user = userEvent.setup();

    await user.click(deletes[0]);

    const names = await container.findAllByTestId('name');

    expect(names).toHaveLength(1);

    expect(names[0].querySelector('input')).toHaveValue('Sam');
  });

  it('test add', async () => {
    const container = render(
      <MockedProvider mocks={mocks}>
        <PeoplePage />
      </MockedProvider>,
    );

    const user = userEvent.setup();

    const name = (await container.findByTestId('addUserName')).querySelector('input');

    if (name === null) {
      throw new Error('name is null');
    }

    await user.type(name, 'Bob');

    const dogStatusInput = container.getByTestId('addUserDogStatus').querySelector('select');

    if (dogStatusInput === null) {
      throw new Error('dogStatus is null');
    }

    user.selectOptions(dogStatusInput, 'Have');

    const add = await container.getByTestId('addUserButton');

    await user.click(add);

    const names = await container.findAllByTestId('name');

    expect(names).toHaveLength(3);

    expect(names[2].querySelector('input')).toHaveValue('Bob');
    const dogStatus = await screen.findAllByTestId('dogStatus');
    expect(dogStatus[2].querySelector('select')).toHaveValue('HAVE');

    const team = await screen.findAllByTestId('team');
    expect(team[2].querySelector('select')).toHaveValue('none');
  });

  it('test team assignment', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <PeoplePage />
      </MockedProvider>,
    );

    const user = userEvent.setup();

    let team = await screen.findAllByTestId('team');

    const select = team[1].querySelector('select');

    if (select === null) {
      throw new Error('select is null');
    }

    await user.selectOptions(select, '4');

    team = await screen.findAllByTestId('team');
    expect(team[1].querySelector('select')).toHaveValue('4');
  });
});
