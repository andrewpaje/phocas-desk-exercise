package com.phocas.exercise.desks;

import com.phocassoftware.graphql.builder.annotations.Context;
import com.phocassoftware.graphql.database.manager.VirtualDatabase;

@Context
public record ApiContext(VirtualDatabase database) {}
