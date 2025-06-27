package com.phocas.exercise.desks;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;

public class Constants {

	public static final ObjectMapper MAPPER = new ObjectMapper()
		.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
		.registerModule(new ParameterNamesModule())
		.registerModule(new Jdk8Module())
		.registerModule(new JavaTimeModule())
		.disable(DeserializationFeature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
		.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
		.disable(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS)
		.disable(SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS)
		.setDefaultPropertyInclusion(Include.NON_NULL);
}
