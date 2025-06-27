package com.phocas.exercise.desks.schema;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Assertions;

import com.phocassoftware.graphql.database.manager.VirtualDatabase;
import com.phocas.exercise.desks.ApiContext;
import com.phocas.exercise.desks.DeskTestDatabase;
import com.phocas.exercise.desks.schema.Person.DogStatus;

public class PersonTest {

	@DeskTestDatabase
	public void testAddingPerson(VirtualDatabase database) {
		var context = new ApiContext(database);
		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.HAVE);
		var people = Person.people(context);
		Assertions.assertEquals(1, people.size());
		james = people.getFirst();
		Assertions.assertEquals("James", james.getName());
		Assertions.assertEquals(DogStatus.HAVE, james.getDogStatus());
		Assertions.assertNotNull(james.getId());
	}

	@DeskTestDatabase
	public void testUpdatePerson(VirtualDatabase database) {
		var context = new ApiContext(database);
		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.HAVE);

		james.setName("James Bond");
		james.setDogStatus(DogStatus.LIKE);

		Person.putPerson(context, Optional.of(james.getId()), james.getName(), james.getDogStatus());

		var people = Person.people(context);
		Assertions.assertEquals(1, people.size());
		james = people.getFirst();
		Assertions.assertEquals("James Bond", james.getName());
		Assertions.assertEquals(DogStatus.LIKE, james.getDogStatus());
	}

	@DeskTestDatabase
	public void testDeletePerson(VirtualDatabase database) {
		var context = new ApiContext(database);
		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.HAVE);
		var people = Person.people(context);
		Assertions.assertEquals(1, people.size());
		Person.deletePerson(context, james.getId());
		people = Person.people(context);
		Assertions.assertEquals(0, people.size());
	}

	@DeskTestDatabase
	public void testTeam(VirtualDatabase database) {

		var context = new ApiContext(database);

		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.HAVE);

		var teamA = Team.putTeam(context, Optional.empty(), "Team A");
		var teamB = Team.putTeam(context, Optional.empty(), "Team B");

		james = Person.setTeam(context, james.getId(), teamA.getId());

		// need to reread from database since was modified with the setTeams calls
		var teamId = james.getTeam(context).get().getId();

		Assertions.assertEquals(teamA.getId(), teamId);

		james = Person.setTeam(context, james.getId(), teamB.getId());

		teamId = james.getTeam(context).get().getId();

		Assertions.assertEquals(teamB.getId(), teamId);

	}

	@DeskTestDatabase
	public void testTeamMembership(VirtualDatabase database) {

		var context = new ApiContext(database);

		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.HAVE);
		var mary = Person.putPerson(context, Optional.empty(), "Mary", DogStatus.HAVE);
		var robert = Person.putPerson(context, Optional.empty(), "Robert", DogStatus.LIKE);

		var teamA = Team.putTeam(context, Optional.empty(), "Team A");
		var teamB = Team.putTeam(context, Optional.empty(), "Team B");

		Person.setTeam(context, james.getId(), teamA.getId());
		Person.setTeam(context, mary.getId(), teamA.getId());
		Person.setTeam(context, robert.getId(), teamB.getId());

		var teams = Team.teams(context);

		Assertions.assertEquals(Set.of(teamA, teamB), new HashSet<>(teams));

		// need to reread from database since was modified with the setTeams calls
		teamA = database.get(Team.class, teamA.getId());
		teamB = database.get(Team.class, teamB.getId());

		var membersA = teamA.getMembers(context);
		Assertions.assertEquals(Set.of(james, mary), new HashSet<>(membersA));

		var membersB = teamB.getMembers(context);
		Assertions.assertEquals(Set.of(robert), new HashSet<>(membersB));

	}

}
