import { DogStatus, type PeopleQuery } from './generated/graphql';
import { reorderSubArray } from './helper/array'

type Person = PeopleQuery['people'][0];

export enum TeamCategory {
  DOG_HATERS, // No HAVES, only AVOID and LIKES
  MIXED, // Atleast 1 of each
  NO_TEAM, // No team
  DOG_LOVERS, // No AVOID, only LIKES and HAVES
}

type TeamSummary = {
  teamId: string | null,
  category: TeamCategory
};

const DogStatusOrder: Record<DogStatus, number> = {
  [DogStatus.Avoid]: 1,
  [DogStatus.Like]: 2,
  [DogStatus.Have]: 3,
};

/**
 * requirements teams must sit together.
 * People who don't like dogs should be placed as far away from those who have dogs as possible.
 * People who have dogs should be placed as far apart as possible.
 * Preference to be given to people who would like to avoid dogs. See Example below
 * Desks are arranged in a single line of adjacent desks.
 * Teams sit next to each other, so the team boundary must be taken into account.
 *
 * For example, if given a single team of 5 people with the following preferences:
 * 1. Alice - likes dogs
 * 2. Bob - likes dogs
 * 3. Charlie - doesn't like dogs
 * 4. David - has a dog
 * 5. Eve - has a dog
 *
 * A valid desk layout would be:
 * Charlie(Avoid), Alice(Like), David(Has), Bob(Like), Eve(Has)
 *
 * If Bob left, then a new valid desk layout would be
 * Charlie(Avoid), Alice(Like), David(Has), Eve(Has)
 *
 * There is a test suite provided that is disabled in calculateDeskLayout.spec.ts
 * This test suite may not be exhaustive for all edge cases.
 */
export const calculateDeskLayout = (people: Person[]): Person[] => {
  // Timsort Complexity used by standard Array.prototype.sort()
  // Source: https://v8.dev/features/stable-sort
  // O(n) at best
  // O(n log n) at average / worst
  let sortedPeople: Person[] = [...people]
  sortedPeople.sort(sortByTeamAndDogStatus);

  // Traverse the list again to categorised the team based on team's dog status
  // O(n)
  const teamSummaries: TeamSummary[] = sortTeamsByCategory(sortedPeople);

  // Map for better efficient lookups
  const teamRankMap = new Map<string, number>();
  teamSummaries.forEach(tp => {
    teamRankMap.set(tp.teamId as string, tp.category);
  });

  // Re-sort the sorted list of people by moving the teams based on the ranking on team's category
  // O(n log n)
  sortedPeople.sort((personA: Person, personB: Person) => {
    // Get the priority rank for team A and team B
    // If a team is not in the teamRankMap, assign a very high rank (lower priority)
    const rankA = teamRankMap.get(personA.team?.id as string) ?? Number.MAX_SAFE_INTEGER;
    const rankB = teamRankMap.get(personB.team?.id as string) ?? Number.MAX_SAFE_INTEGER;

    // Primary sort - team category rank
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // Secondary sort - if ranks are equal, sort by team id alphabetically
    if(personA.team && personB.team) {
      const teamIdComparison = (personA.team?.id as string).localeCompare(personB.team?.id as string);
      if (teamIdComparison !== 0) {
        return teamIdComparison;
      }
    }

    return 0
  });

  // Finally, we move the people who like and have dogs alternately
  // O(n)
  let currTeam: string | undefined = undefined
  let startPointer: number = 0
  let startSearchFlag: boolean = false
  let updatedPeople: Person[] = [...sortedPeople]
  
  sortedPeople.forEach((person: Person, index: number) => {
    if(!currTeam) {
      currTeam = person.team?.id
    }

    // We re-order the subarray based on the sorting logic
    if(startSearchFlag && (person.team?.id != currTeam
      || (person.team?.id == currTeam && person.dogStatus === DogStatus.Avoid))) {
      updatedPeople = reorderSubArray(updatedPeople, startPointer, index - 1, insertPeopleWithDogLogic)
      startSearchFlag = false
    }

    // Trigger search flag if we found our first non Avoid status
    if(!startSearchFlag && person.dogStatus !== DogStatus.Avoid) {
      currTeam = person.team?.id
      startPointer = index
      startSearchFlag = true
    }
  })

  if(startSearchFlag) {
    updatedPeople = reorderSubArray(updatedPeople, startPointer, updatedPeople.length - 1, insertPeopleWithDogLogic)
  }

  return updatedPeople;
};

const sortByTeamAndDogStatus = (personA: Person, personB: Person) => {
  // Apply sort only if teams on both person is not null
  if (personA.team && personB.team) {
    // Group by Team, order of the team should not matter
    if (personA.team.id != personB.team.id) return personA.team.id.localeCompare(personB.team.id);
  }

  // If both have no team, we still apply here secondary condition of Dog Status sort
  // After getting grouped by team, sort to follow: Avoid - Like - Have
  if (DogStatusOrder[personA.dogStatus] < DogStatusOrder[personB.dogStatus]) return -1;
  else if (DogStatusOrder[personA.dogStatus] > DogStatusOrder[personB.dogStatus]) return 1;

  return 0;
};

const sortTeamsByCategory = (people: Person[]): TeamSummary[] => {
  const teamDogStatusCount: Record<DogStatus, number> = {
    [DogStatus.Avoid]: 0,
    [DogStatus.Like]: 0,
    [DogStatus.Have]: 0,
  }

  let currTeam: TeamSummary = {
    teamId: null,
    category: TeamCategory.NO_TEAM
  }
  let teamSummaries: TeamSummary[] = []

  people.forEach((person: Person) => {
    if(!currTeam.teamId) {
      currTeam = {
        teamId: person.team?.id ?? null,
        category: TeamCategory.NO_TEAM
      }
    }

    if(currTeam && currTeam.teamId != (person.team?.id ?? null)) {
      // Push Current Team to summaries
      currTeam.category = categoriseTeam(teamDogStatusCount)
      teamSummaries.push(currTeam)

      // Refresh pointers
      currTeam = {
        teamId: person.team?.id ?? null,
        category: TeamCategory.NO_TEAM
      }
      teamDogStatusCount.AVOID = 0
      teamDogStatusCount.HAVE = 0
      teamDogStatusCount.LIKE = 0
    }
    
    switch(person.dogStatus) {
    case DogStatus.Avoid:
      teamDogStatusCount.AVOID++
      break
    case DogStatus.Have:
      teamDogStatusCount.HAVE++
      break
    case DogStatus.Like:
      teamDogStatusCount.LIKE++
      break
    }
  });

  currTeam.category = categoriseTeam(teamDogStatusCount)
  teamSummaries.push(currTeam)

  return teamSummaries.sort((teamA: TeamSummary, teamB: TeamSummary) => {
    // Order all teams based on category enum ordering
    return teamA.category - teamB.category;
  })
}

const categoriseTeam = (teamDogStatusCount: Record<DogStatus, number>) => {
  if(teamDogStatusCount.AVOID == 0) return TeamCategory.DOG_LOVERS

  if(teamDogStatusCount.HAVE == 0) return TeamCategory.DOG_HATERS

  if(teamDogStatusCount.AVOID > 0 && teamDogStatusCount.HAVE > 0) return TeamCategory.MIXED

  return TeamCategory.NO_TEAM
};

const insertPeopleWithDogLogic = (subArray: Person[]): Person[] => {
  if(subArray.length <= 3) {
    return subArray
  }

  // Find split point by comparing dogStatus is not the same as 1st index
  const splitPoint = subArray.findIndex(
    (item: Person, index: number, arr: Person[]) => index > 0 && item.dogStatus !== arr[0].dogStatus
  )

  const resultArray: Person[] = []
  if(splitPoint != -1) {
    const groupA = subArray.slice(0, splitPoint);
    const groupB = subArray.slice(splitPoint);

    let [indexA, indexB] = [0, 0]
    // Alternate them until 1 index runs out
    while(indexA < groupA.length && indexB < groupB.length) {
      resultArray.push(groupA[indexA++])
      resultArray.push(groupB[indexB++])
    }

    // Exhaust the remaining items and add to the end
    while (indexA < groupA.length) {
      resultArray.push(groupA[indexA++]);
    }

    while (indexB < groupB.length) {
      resultArray.push(groupB[indexB++]);
    }

    return resultArray;
  }

  return subArray
}
