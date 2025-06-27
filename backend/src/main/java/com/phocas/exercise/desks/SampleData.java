package com.phocas.exercise.desks;

import java.util.Optional;

import com.phocassoftware.graphql.database.manager.VirtualDatabase;
import com.phocas.exercise.desks.schema.Person;
import com.phocas.exercise.desks.schema.Person.DogStatus;
import com.phocas.exercise.desks.schema.Team;

public class SampleData {

	public static void add(VirtualDatabase database) {
		var context = new ApiContext(database);

		var john = Person.putPerson(context, Optional.empty(), "John", DogStatus.LIKE);
		var jill = Person.putPerson(context, Optional.empty(), "Jill", DogStatus.LIKE);
		var jasper = Person.putPerson(context, Optional.empty(), "Jasper", DogStatus.LIKE);
		var james = Person.putPerson(context, Optional.empty(), "James", DogStatus.LIKE);
		var jack = Person.putPerson(context, Optional.empty(), "Jack", DogStatus.LIKE);
		var jane = Person.putPerson(context, Optional.empty(), "Jane", DogStatus.LIKE);
		var jenny = Person.putPerson(context, Optional.empty(), "Jenny", DogStatus.AVOID);
		var jordan = Person.putPerson(context, Optional.empty(), "Jordan", DogStatus.AVOID);
		var jeremy = Person.putPerson(context, Optional.empty(), "Jeremy", DogStatus.AVOID);
		var jim = Person.putPerson(context, Optional.empty(), "Jim", DogStatus.HAVE);
		var julia = Person.putPerson(context, Optional.empty(), "Julia", DogStatus.HAVE);
		var jessica = Person.putPerson(context, Optional.empty(), "Jessica", DogStatus.HAVE);

		Team team1 = Team.putTeam(context, Optional.empty(), "Alpha Squad");
		Team team2 = Team.putTeam(context, Optional.empty(), "Beta Brigade");
		Team team3 = Team.putTeam(context, Optional.empty(), "Gamma Group");

		Person.setTeam(context, john.getId(), team1.getId());
		Person.setTeam(context, jane.getId(), team1.getId());
		Person.setTeam(context, jenny.getId(), team1.getId());
		Person.setTeam(context, jordan.getId(), team1.getId());
		Person.setTeam(context, jack.getId(), team2.getId());
		Person.setTeam(context, jill.getId(), team2.getId());
		Person.setTeam(context, james.getId(), team2.getId());
		Person.setTeam(context, julia.getId(), team2.getId());
		Person.setTeam(context, jim.getId(), team3.getId());
		Person.setTeam(context, jasper.getId(), team3.getId());
		Person.setTeam(context, jessica.getId(), team3.getId());
		Person.setTeam(context, jeremy.getId(), team3.getId());

	}

}