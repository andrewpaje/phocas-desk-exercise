package com.phocas.exercise.desks;

import java.time.Instant;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;

public class InstantCoercing implements Coercing<Instant, Instant> {

	public static final GraphQLScalarType INSTANCE = new GraphQLScalarType.Builder().name("Instant").coercing(new InstantCoercing()).build();

	@Override
	public Instant serialize(Object dataFetcherResult) throws CoercingSerializeException {
		return convertImpl(dataFetcherResult);
	}

	@Override
	public Instant parseValue(Object input) throws CoercingParseValueException {
		return convertImpl(input);
	}

	@Override
	public Instant parseLiteral(Object input) throws CoercingParseLiteralException {
		return convertImpl(input);
	}

	private Instant convertImpl(Object input) {
		switch (input) {
			case Instant instant -> {
				return instant;
			}
			case StringValue sv -> {
				return Instant.parse(sv.getValue());
			}
			case String string -> {
				return Instant.parse(string);
			}
			default -> {}
		}
		if (input instanceof Long milli) {
			return Instant.ofEpochMilli(milli);
		}
		return null;
	}
}
