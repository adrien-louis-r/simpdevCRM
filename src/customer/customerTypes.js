const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    customerList: [Customer!]!
    customer(id: ID!): Customer!
  }

  type Customer {
    id: ID!
    email: String!
    lastname: String!
    firstname: String!
  }
`;

module.exports = typeDefs;
