const { gql } = require('apollo-server');

const {
  NOT_FOUND_FRAGMENT,
  INVALID_PARAM_FRAGMENT,
  BAD_USER_INPUT_FRAGMENT,
  DELETE_FRAGMENT,
  CONTACT_FRAGMENT,
  CONTACT_RELATIONSHIP_FRAGMENT,
} = require('./fragments');

const GET_CONTACT_LIST = gql`
  {
    contactList {
      ...ContactData
    }
  }
  ${CONTACT_FRAGMENT}
`;

const GET_CONTACT = gql`
  query contact($id: ID!) {
    contact(id: $id) {
      ...ContactData
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${CONTACT_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

const ADD_CONTACT = gql`
  mutation addContact($contact: ContactInput!) {
    addContact(contact: $contact) {
      ...ContactData
      ...ContactRelationshipData
      ...BadUserInput
    }
  }
  ${CONTACT_FRAGMENT}
  ${CONTACT_RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
`;

const UPDATE_CONTACT = gql`
  mutation updateContact($id: ID!, $contact: ContactInput!) {
    updateContact(id: $id, contact: $contact) {
      ...ContactData
      ...ContactRelationshipData
      ...BadUserInput
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${CONTACT_FRAGMENT}
  ${CONTACT_RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

const REMOVE_CONTACT = gql`
  mutation removeContact($id: ID!) {
    removeContact(id: $id) {
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
  GET_CONTACT,
  GET_CONTACT_LIST,
  ADD_CONTACT,
  UPDATE_CONTACT,
  REMOVE_CONTACT,
};
