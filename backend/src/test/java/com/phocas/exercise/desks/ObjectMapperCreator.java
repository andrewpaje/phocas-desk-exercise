package com.phocas.exercise.desks;

import java.util.function.Supplier;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectMapperCreator implements Supplier<ObjectMapper> {

	@Override
	public ObjectMapper get() {
		return Constants.MAPPER;
	}
}
