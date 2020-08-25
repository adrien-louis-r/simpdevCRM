import { gql } from "@apollo/client";

const RELATIONSHIP_FRAGMENT = gql`
  fragment RelationshipData on Relationship {
    id
    name
    type
  }
`;

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

const GET_RELATIONSHIP_LIST = gql`
  query relationshipList($params: PaginationInput) {
    relationshipList(params: $params) {
      total
      items {
        ...RelationshipData
      }
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
      ... on BadUserInput {
        errors {
          field
          message
        }
      }
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const REMOVE_RELATIONSHIP = gql`
  mutation removeRelationship($id: ID!) {
    removeRelationship(id: $id) {
      id
      success
    }
  }
`;

export {
  ADD_RELATIONSHIP,
  GET_RELATIONSHIP,
  GET_RELATIONSHIP_LIST,
  REMOVE_RELATIONSHIP,
};
