package com.phocas.exercise.desks;

import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import graphql.GraphQL;
import graphql.introspection.IntrospectionQuery;
import graphql.introspection.IntrospectionResultToSchema;
import graphql.schema.idl.SchemaPrinter;

public class GraphQLSchemaPrinter {
	public static void main(String[] args) {

		// turn of all logging
		Logger root = (Logger) LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
		root.setLevel(Level.OFF);

		var schema = new AppConfiguration().graphQLSchema();
		var graph = new GraphQL.Builder(schema).build();

		var introspection = graph.execute(IntrospectionQuery.INTROSPECTION_QUERY);

		var printer = new SchemaPrinter(SchemaPrinter.Options.defaultOptions().includeSchemaDefinition(true));
		var sdl = printer.print(new IntrospectionResultToSchema().createSchemaDefinition(introspection));
		System.out.println(sdl);
	}
}