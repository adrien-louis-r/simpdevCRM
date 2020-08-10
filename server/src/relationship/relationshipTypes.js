const { gql } = require('apollo-server');

const typeDefs = gql`
  input ContactInput {
    relationshipId: ID
    email: String!
    lastname: String!
    firstname: String!
    phone: String
    mobile: String
  }

  input RelationshipInput {
    name: String!
    type: String!
  }

  type Contact {
    id: ID!
    email: String!
    lastname: String!
    firstname: String!
    phone: String
    mobile: String
    relationship: Relationship
  }

  type Relationship {
    id: ID!
    name: String!
    type: String!
    contactList: [Contact]!
  }

  type RemoveContactMutationResponse {
    id: ID!
    success: Boolean!
  }

  type DeleteResult {
    id: ID!
    success: Boolean!
  }

  type InputError {
    field: String!
    message: String!
  }

  type BadUserInput {
    errors: [InputError]!
  }

  type NotFoundEntity {
    message: String!
  }

  type InvalidParam {
    message: String!
  }

  union RelationshipMutationResult = Relationship | BadUserInput

  union ContactMutationResult = Contact | BadUserInput

  union RelationshipUpdateMutationResult =
      Relationship
    | BadUserInput
    | NotFoundEntity
    | InvalidParam

  union ContactUpdateMutationResult = Contact | BadUserInput | NotFoundEntity | InvalidParam

  union MandatoryRelationship = Relationship | NotFoundEntity | InvalidParam

  union MandatoryContact = Contact | NotFoundEntity | InvalidParam

  union DeleteMutationResult = DeleteResult | NotFoundEntity | InvalidParam

  type Query {
    contactList: [Contact!]!
    contact(id: ID!): MandatoryContact!
    relationshipList: [Relationship!]!
    relationship(id: ID!): MandatoryRelationship!
  }

  type Mutation {
    addRelationship(relationship: RelationshipInput!): RelationshipMutationResult!
    updateRelationship(id: ID!, relationship: RelationshipInput!): RelationshipUpdateMutationResult!
    removeRelationship(id: ID!): DeleteMutationResult!
    addContact(contact: ContactInput!): ContactMutationResult!
    updateContact(id: ID!, contact: ContactInput!): ContactUpdateMutationResult!
    removeContact(id: ID!): DeleteMutationResult!
  }
`;

module.exports = typeDefs;
