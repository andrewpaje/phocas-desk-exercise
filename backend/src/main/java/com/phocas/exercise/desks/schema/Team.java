package com.phocas.exercise.desks.schema;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.phocassoftware.graphql.builder.annotations.Id;
import com.phocassoftware.graphql.builder.annotations.Mutation;
import com.phocassoftware.graphql.builder.annotations.Query;
import com.phocassoftware.graphql.database.manager.Table;
import com.phocas.exercise.desks.ApiContext;

public class Team extends Table {

	private final String name;

	@JsonCreator
	public Team(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public List<Person> getMembers(ApiContext context) {
		return context.database().getLinks(this, Person.class);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + Objects.hash(name);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (!super.equals(obj)) return false;
		if (getClass() != obj.getClass()) return false;
		Team other = (Team) obj;
		return Objects.equals(name, other.name);
	}

	@Query
	public static List<Team> teams(ApiContext context) {
		return context.database().query(Team.class);
	}

	@Mutation
	public static Team putTeam(ApiContext context, @Id Optional<String> id, String name) {
		var team = new Team(name);
		team.setId(id.orElse(context.database().newId()));
		return context.database().put(team);
	}

}
