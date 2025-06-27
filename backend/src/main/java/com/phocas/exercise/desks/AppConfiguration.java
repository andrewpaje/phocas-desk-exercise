package com.phocas.exercise.desks;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;

import org.dataloader.DataLoaderRegistry;
import org.springframework.boot.autoconfigure.graphql.GraphQlSourceBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.amazonaws.services.dynamodbv2.local.main.ServerRunner;
import com.phocassoftware.graphql.builder.SchemaBuilder;
import com.phocassoftware.graphql.database.manager.DatabaseManager;
import com.phocassoftware.graphql.database.manager.dynamo.DynamoDbManager;

import graphql.scalars.ExtendedScalars;
import graphql.schema.GraphQLSchema;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeDefinition;
import software.amazon.awssdk.services.dynamodb.model.GlobalSecondaryIndex;
import software.amazon.awssdk.services.dynamodb.model.KeySchemaElement;
import software.amazon.awssdk.services.dynamodb.model.KeyType;
import software.amazon.awssdk.services.dynamodb.model.ProjectionType;
import software.amazon.awssdk.services.dynamodb.model.ScalarAttributeType;
import software.amazon.awssdk.services.dynamodb.model.StreamViewType;

@Configuration
@EnableScheduling
public class AppConfiguration {

	private static final String ENTITIES = "entities";

	private static final String SINGLE_ORGANISATION = "singleOrganisation";

	@Bean
	String port() throws IOException {
		final var serverSocket = new ServerSocket(0);
		final var port = String.valueOf(serverSocket.getLocalPort());
		serverSocket.close();

		return port;
	}

	@Bean
	public DynamoDbAsyncClient dynamoAsyncClient(String port) throws Exception {

		Files.createDirectories(Paths.get("database"));

		final String[] localArgs = { "-port", port, "-dbPath", "database" };
		final var server = ServerRunner.createServerFromCommandLineArgs(localArgs);
		server.start();

		var client = DynamoDbAsyncClient
			.builder()
			.region(Region.AWS_GLOBAL)
			.credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("anything", "anything")))
			.endpointOverride(new URI("http://localhost:" + port))
			.build();

		if (createTable(client, ENTITIES)) {
			var database = databaseManager(client).getVirtualDatabase(AppConfiguration.SINGLE_ORGANISATION);

			SampleData.add(database);
		}

		return client;
	}

	static boolean createTable(final DynamoDbAsyncClient client, final String name) throws ExecutionException, InterruptedException {
		if (client.listTables().get().tableNames().contains(name)) {
			return false;
		}

		client
			.createTable(
				t -> t
					.tableName(name)
					.keySchema(
						KeySchemaElement.builder().attributeName("organisationId").keyType(KeyType.HASH).build(),
						KeySchemaElement.builder().attributeName("id").keyType(KeyType.RANGE).build()
					)
					.streamSpecification(streamSpecification -> streamSpecification.streamEnabled(true).streamViewType(StreamViewType.NEW_IMAGE))
					.globalSecondaryIndexes(
						GlobalSecondaryIndex
							.builder()
							.indexName("secondaryGlobal")
							.provisionedThroughput(p -> p.readCapacityUnits(10L).writeCapacityUnits(10L))
							.projection(b -> b.projectionType(ProjectionType.ALL))
							.keySchema(KeySchemaElement.builder().attributeName("secondaryGlobal").keyType(KeyType.HASH).build())
							.build(),
						GlobalSecondaryIndex
							.builder()
							.indexName("parallelIndex")
							.provisionedThroughput(p -> p.readCapacityUnits(10L).writeCapacityUnits(10L))
							.projection(b -> b.projectionType(ProjectionType.ALL))
							.keySchema(
								KeySchemaElement.builder().attributeName("organisationId").keyType(KeyType.HASH).build(),
								KeySchemaElement.builder().attributeName("parallelHash").keyType(KeyType.RANGE).build()
							)
							.build(),
						GlobalSecondaryIndex
							.builder()
							.indexName("secondaryOrganisation")
							.provisionedThroughput(p -> p.readCapacityUnits(10L).writeCapacityUnits(10L))
							.projection(b -> b.projectionType(ProjectionType.ALL))
							.keySchema(
								KeySchemaElement.builder().attributeName("organisationId").keyType(KeyType.HASH).build(),
								KeySchemaElement.builder().attributeName("secondaryOrganisation").keyType(KeyType.RANGE).build()
							)
							.build()
					)
					.attributeDefinitions(
						AttributeDefinition.builder().attributeName("organisationId").attributeType(ScalarAttributeType.S).build(),
						AttributeDefinition.builder().attributeName("id").attributeType(ScalarAttributeType.S).build(),
						AttributeDefinition.builder().attributeName("secondaryGlobal").attributeType(ScalarAttributeType.S).build(),
						AttributeDefinition.builder().attributeName("secondaryOrganisation").attributeType(ScalarAttributeType.S).build(),
						AttributeDefinition.builder().attributeName("parallelHash").attributeType(ScalarAttributeType.S).build()
					)
					.provisionedThroughput(p -> p.readCapacityUnits(10L).writeCapacityUnits(10L).build())
			)
			.get();
		return true;
	}

	@Bean
	public DatabaseManager databaseManager(DynamoDbAsyncClient client) {
		return DynamoDbManager.builder().tables(ENTITIES).objectMapper(Constants.MAPPER).dynamoDbAsyncClient(client).build();
	}

	@Bean
	public GraphQLSchema graphQLSchema() {
		var schema = SchemaBuilder
			.builder()
			.classpath("com.phocas.exercise.desks.schema")
			.scalar(ExtendedScalars.GraphQLLong)
			.scalar(InstantCoercing.INSTANCE)
			.scalar(ExtendedScalars.UUID)
			.build()
			.build();
		return schema;
	}

	@Bean
	public GraphQlSourceBuilderCustomizer sourceBuilderCustomizer() {
		var schema = graphQLSchema();
		return builder -> builder
			.schemaFactory((__, ___) -> schema);
	}

	@Bean
	public WebGraphQlInterceptor graphInterceptor(DatabaseManager manager) {
		return new WebGraphQlInterceptor() {
			@Override
			public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
				request.configureExecutionInput((__, builder) -> {
					builder.dataLoaderRegistry(new DataLoaderRegistry());
					var database = manager.getVirtualDatabase(SINGLE_ORGANISATION);
					builder.graphQLContext(content -> {
						content.put("context", new ApiContext(database));
					});
					return builder.build();
				});
				return chain.next(request);
			}
		};
	}
}
