const { gql } = require('apollo-server');

const NOT_FOUND_FRAGMENT = gql`
  fragment NotFoundMessage on NotFoundEntity {
    message
  }
`;

const INVALID_PARAM_FRAGMENT = gql`
  fragment InvalidParamMessage on InvalidParam {
    message
  }
`;

const BAD_USER_INPUT_FRAGMENT = gql`
  fragment BadUserInput on BadUserInput {
    errors {
      field
      message
    }
  }
`;

const DELETE_FRAGMENT = gql`
  fragment DeleteFragment on DeleteResult {
    id
    success
  }
`;

const RELATIONSHIP_FRAGMENT = gql`
  fragment RelationshipData on Relationship {
    id
    name
    type
  }
`;

const CONTACT_FRAGMENT = gql`
  fragment ContactData on Contact {
    id
    email
    lastname
    firstname
  }
`;

const CONTACT_RELATIONSHIP_FRAGMENT = gql`
  fragment ContactRelationshipData on Contact {
    relationship {
      ...RelationshipData
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

module.exports = {
  NOT_FOUND_FRAGMENT,
  INVALID_PARAM_FRAGMENT,
  BAD_USER_INPUT_FRAGMENT,
  DELETE_FRAGMENT,
  RELATIONSHIP_FRAGMENT,
  CONTACT_FRAGMENT,
  CONTACT_RELATIONSHIP_FRAGMENT,
};
