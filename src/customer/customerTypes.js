const { gql } = require('apollo-server');

const typeDefs = gql`
  input CustomerInput {
    email: String!
    lastname: String!
    firstname: String!
    phone: String
    mobile: String
  }

  type Customer {
    id: ID!
    email: String!
    lastname: String!
    firstname: String!
    phone: String
    mobile: String
  }

  type Query {
    customerList: [Customer!]!
    customer(id: ID!): Customer!
  }

  type Mutation {
    addCustomer(customer: CustomerInput!): Customer!
    updateCustomer(id: ID!, customer: CustomerInput!): Customer!
  }
`;

module.exports = typeDefs;
