import type { CodegenConfig } from '@graphql-codegen/cli';
import { execSync } from 'node:child_process';

console.log('Generating graphql schema...')
var schema =  execSync('mvn -f backend/pom.xml -q compile exec:java -Dexec.mainClass=com.phocas.exercise.desks.GraphQLSchemaPrinter').toString()
console.log('Schema generation complete.')
const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: ['frontend/src/**/*.tsx', 'frontend/src/**/*.ts'],
  generates: {
    'frontend/src/generated/': {
      preset: 'client',
      presetConfig: {
        persistedDocuments: true,
      },
    },
  },
};

export default config;
