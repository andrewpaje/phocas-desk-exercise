import { describe, expect, it } from 'vitest';

import { calculateDeskLayout } from './calculateDeskLayout';
import { DogStatus } from './generated/graphql';
import { orderChecker } from './orderChecker';
import { testPersonBuilder as person } from './testUtil';

type Person = ReturnType<typeof calculateDeskLayout>[0];

describe.skip('calculateDeskLayout', () => {
  it('single team no dogs order not important', () => {
    const people = [
      person('1', DogStatus.Like),
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
    ];
    expect(process(people)).toBe(0);
  });

  it('two team, they are together', () => {
    const people = [
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('2', DogStatus.Avoid),
      person('2', DogStatus.Avoid),
      person('2', DogStatus.Like),
    ];
    expect(process(people)).toBe(0);
  });

  it('one team. One person with a dog and person who dislikes at either end', () => {
    const people = [
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('1', DogStatus.Avoid),
    ];
    expect(process(people)).toBe(4);
  });

  it('two team. One person with a dog and person who dislikes at either end', () => {
    const people = [
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('2', DogStatus.Like),
      person('2', DogStatus.Avoid),
    ];
    expect(process(people)).toBe(4);
  });

  it('one team. People that dislike together people with dogs spaced', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(process(people)).toBeGreaterThanOrEqual(4);
  });
});

const process = (people: Person[]) => {
  return orderChecker(calculateDeskLayout(shuffle(people)));
};

const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
