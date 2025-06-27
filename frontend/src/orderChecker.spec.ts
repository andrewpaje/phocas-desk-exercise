import { describe, expect, it } from 'vitest';

import type { calculateDeskLayout } from './calculateDeskLayout';
import { DogStatus } from './generated/graphql';
import { orderChecker } from './orderChecker';
import { testPersonBuilder as person } from './testUtil';

type Person = ReturnType<typeof calculateDeskLayout>[0];

const testOrder = (people: Person[]) => {
  let first: number | undefined;
  let firstError: unknown | undefined;
  try {
    first = orderChecker(people);
  } catch (e) {
    firstError = e;
  }

  let second: number | undefined;
  let secondError: unknown | undefined;
  try {
    second = orderChecker(people.toReversed());
  } catch (e) {
    secondError = e;
  }
  expect(first, 'reverse score different').toBe(second);

  expect(firstError === undefined, 'errors different').toBe(secondError === undefined);

  if (firstError !== undefined) {
    throw firstError;
  }

  return first;
};

describe('test orderChecker function', () => {
  it('check adjacent teams does not throw error', () => {
    const people = [
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('2', DogStatus.Avoid),
    ];
    expect(() => testOrder(people)).not.toThrowError();
  });
  it('check team mixed throws error', () => {
    const people = [
      person('1', DogStatus.Like),
      person('2', DogStatus.Avoid),
      person('1', DogStatus.Like),
    ];
    expect(() => testOrder(people)).toThrowError();
  });

  it('check person with dog sitting next to person without dog zero score', () => {
    const people = [person('1', DogStatus.Avoid), person('1', DogStatus.Have)];
    expect(testOrder(people)).toEqual(0);
  });

  it('score no dogs returns zero', () => {
    const people = [
      person('1', DogStatus.Like),
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
    ];
    expect(testOrder(people)).toEqual(0);
  });

  it('score dog 1 person away from avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(2);
  });

  it('score dog 1 person away from 2 avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(3);
  });

  it('score people with dogs one person away', () => {
    const people = [
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(2);
  });
  it('score dog 2 person away from avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(4);
  });
  it('score people with dogs 2 person away', () => {
    const people = [
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(4);
  });

  it('error if like between dog owners not avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(() => testOrder(people)).toThrowError();
  });
  it('accept if like between dog owners and avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
      person('1', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(1);
  });
  it('error if more likes between dog owners not avoid', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
    ];
    expect(() => testOrder(people)).toThrowError();
  });
  it('error if like could be between dog owners', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('1', DogStatus.Like),
      person('1', DogStatus.Like),
      person('1', DogStatus.Have),
      person('1', DogStatus.Have),
    ];
    expect(() => testOrder(people)).toThrowError();
  });

  it('score if more likes between dog owners not avoid two teams', () => {
    const people = [
      person('1', DogStatus.Avoid),
      person('2', DogStatus.Avoid),
      person('2', DogStatus.Have),
      person('3', DogStatus.Like),
      person('3', DogStatus.Have),
    ];
    expect(testOrder(people)).toEqual(1);
  });
});
