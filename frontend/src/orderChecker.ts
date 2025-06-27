import { DogStatus, type PeopleQuery } from './generated/graphql';

type Person = PeopleQuery['people'][0];

/**
 * Attempts to validate th order of the people provided.
 * Will error if teams are not sitting together or if people with dogs are too close and detects more optimal solution.
 * Returns a score based on how many people who like dogs are between people with dogs and people who dislike dogs. And how many people who like dogs are between people with dogs are.
 *
 * @param people
 * @returns score calculated from logic above
 */
export const orderChecker = (people: Person[]): number => {
  const seenTeams = new Set<string>();
  let previous: Person | undefined;

  for (const person of people) {
    const team = person.team?.id ?? 'none';
    if (previous !== undefined && previous.team?.id !== person.team?.id) {
      if (seenTeams.has(team)) {
        throw new Error(`team ${team} not sitting together`);
      }
    }
    seenTeams.add(team);
    previous = person;
  }

  const result = people.map((person, index) => processPerson(people, person, index));

  const metrics = teamMaxDistance(result);

  // try confirm that distances follow rules around spaces between people
  for (const { person, distance } of result) {
    const team = person.team?.id ?? 'none';
    const teamMetrics = metrics.get(team);
    if (person.dogStatus === DogStatus.Avoid) {
      if ((teamMetrics?.have ?? 0) > distance) {
        throw new Error(
          `team ${team} Has people with dogs further apart than avoid ${teamMetrics} vs ${distance}`,
        );
      }
    }
    if (person.dogStatus === DogStatus.Have) {
      if ((teamMetrics?.avoid ?? 0) - 1 > distance) {
        throw new Error(
          `team ${team} Has people with dogs that could have a person who likes dogs between them`,
        );
      }
    }
  }

  return result
    .map(({ person, distance }) => {
      if (person.dogStatus === DogStatus.Avoid) {
        return distance;
      }
      if (person.dogStatus === DogStatus.Have) {
        return distance;
      }
      return 0;
    })
    .reduce((a, b) => a + b, 0);
};

const processPerson = (people: Person[], person: Person, index: number) => {
  // distance to nearest person with dog

  let other = DogStatus.Have;
  if (person.dogStatus === DogStatus.Have) {
    other = DogStatus.Avoid;
  }

  let dogIndexForward = people.findIndex(
    (p, i) => i > index && (p.dogStatus === DogStatus.Have || p.dogStatus === other),
  );
  let dogIndexReverse = people.findLastIndex(
    (p, i) => i < index && (p.dogStatus === DogStatus.Have || p.dogStatus === other),
  );

  let distance = 0;
  if ((dogIndexForward !== -1 || dogIndexReverse !== -1) && person.dogStatus !== DogStatus.Like) {
    if (dogIndexForward === -1) {
      dogIndexForward = Number.MAX_VALUE;
    } else {
      dogIndexForward = people
        .slice(index, dogIndexForward)
        .filter((p) => p.dogStatus === DogStatus.Like).length;
    }
    if (dogIndexReverse === -1) {
      dogIndexReverse = Number.MAX_VALUE;
    } else {
      dogIndexReverse = people
        .slice(dogIndexReverse, index)
        .filter((p) => p.dogStatus === DogStatus.Like).length;
    }
    distance = Math.min(dogIndexForward, dogIndexReverse);
  }
  return {
    person,
    index,
    distance,
  };
};

const teamMaxDistance = (people: PersonMetric[]) => {
  const teamMetrics = new Map<string, { have: number; avoid: number }>();

  for (const { person, distance } of people) {
    const team = person.team?.id ?? 'none';
    let metrics = teamMetrics.get(team);

    if (person.dogStatus === DogStatus.Have) {
      metrics = {
        have: Math.max(metrics?.have ?? 0, distance),
        avoid: metrics?.avoid ?? 0,
      };
      teamMetrics.set(team, metrics);
    }
    if (person.dogStatus === DogStatus.Avoid) {
      metrics = {
        avoid: Math.max(metrics?.avoid ?? 0, distance),
        have: metrics?.have ?? 0,
      };
      teamMetrics.set(team, metrics);
    }
  }
  return teamMetrics;
};

type PersonMetric = ReturnType<typeof processPerson>;
