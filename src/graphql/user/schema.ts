import { makeExecutableSchema, mergeResolvers } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import resolvers from './resolvers';
import path from 'path';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));


export default makeExecutableSchema({ typeDefs, resolvers });