const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const relationship = require('./relationship/index');

const server = new ApolloServer({
  schema: buildFederatedSchema(relationship),
});

module.exports = server;
