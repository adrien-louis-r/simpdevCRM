const { gql } = require('apollo-server');
const {
  NOT_FOUND_FRAGMENT,
  INVALID_PARAM_FRAGMENT,
  BAD_USER_INPUT_FRAGMENT,
  DELETE_FRAGMENT,
  RELATIONSHIP_FRAGMENT,
} = require('./fragments');

const GET_RELATIONSHIP_LIST = gql`
  {
    relationshipList {
      ...RelationshipData
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const GET_RELATIONSHIP = gql`
  query relationship($id: ID!) {
    relationship(id: $id) {
      ...RelationshipData
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

const ADD_RELATIONSHIP = gql`
  mutation addRelationship($relationship: RelationshipInput!) {
    addRelationship(relationship: $relationship) {
      ...RelationshipData
      ...BadUserInput
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
`;

const UPDATE_RELATIONSHIP = gql`
  mutation updateRelationship($id: ID!, $relationship: RelationshipInput!) {
    updateRelationship(id: $id, relationship: $relationship) {
      ...RelationshipData
      ...BadUserInput
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

const REMOVE_RELATIONSHIP = gql`
  mutation removeRelationship($id: ID!) {
    removeRelationship(id: $id) {
      ...DeleteFragment
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${DELETE_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

module.exports = {
  GET_RELATIONSHIP,
  GET_RELATIONSHIP_LIST,
  ADD_RELATIONSHIP,
  UPDATE_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
};
