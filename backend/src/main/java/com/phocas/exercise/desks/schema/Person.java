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

public class Person extends Table {

	public enum DogStatus {
		LIKE,
		AVOID,
		HAVE
	};

	private String name;
	private DogStatus dogStatus;

	@JsonCreator
	public Person(String id) {
		setId(id);
	}

	public Person(String name, DogStatus dogStatus) {
		this.name = name;
		this.dogStatus = dogStatus;
	}

	public String getName() {
		return name;
	}

	public DogStatus getDogStatus() {
		return dogStatus;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDogStatus(DogStatus dogStatus) {
		this.dogStatus = dogStatus;
	}

	public Optional<Team> getTeam(ApiContext context) {
		return context.database().getLinkOptional(this, Team.class);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + Objects.hash(dogStatus, name);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (!super.equals(obj)) return false;
		if (getClass() != obj.getClass()) return false;
		Person other = (Person) obj;
		return dogStatus == other.dogStatus && Objects.equals(name, other.name);
	}

	@Override
	public String toString() {
		return "Person [name=" + name + ", dogStatus=" + dogStatus + "]";
	}

	@Query
	public static List<Person> people(ApiContext context) {
		return context.database().query(Person.class);
	}

	@Mutation
	public static Person putPerson(ApiContext context, @Id Optional<String> id, String name, DogStatus dogStatus) {

		var person = id.map(i -> context.database().get(Person.class, i)).orElse(new Person(context.database().newId()));

		person.setDogStatus(dogStatus);
		person.setName(name);
		return context.database().put(person);
	}

	@Mutation
	public static Person setTeam(ApiContext context, @Id String userId, @Id String teamId) {

		var person = context.database().get(Person.class, userId);

		return context.database().link(person, Team.class, teamId);
	}

	@Mutation
	public static Person deletePerson(ApiContext context, @Id String id) {
		var person = context.database().get(Person.class, id);
		return context.database().delete(person, true);
	}

}
