const model = require('./relationshipModel');
const { NoSuchEntity, InvalidParam } = require('../errors');

function handleMandatoryEntity(err, message) {
  if (err instanceof NoSuchEntity) {
    return {
      __typename: 'NotFoundEntity',
      message,
    };
  }

  if (err instanceof InvalidParam) {
    return {
      __typename: 'InvalidParam',
      message,
    };
  }

  throw err;
}

function formatValidationErrors(err) {
  return err.details.map((detail) => {
    return {
      field: detail.context.key || detail.context.label,
      message: detail.message,
    };
  });
}

function handleBadUserInput(err) {
  if (err.name === 'ValidationError') {
    return {
      __typename: 'BadUserInput',
      errors: formatValidationErrors(err),
    };
  }

  throw err;
}

const resolvers = {
  Query: {
    relationshipList: () => model.allRelationship(),
    relationship: async (_, { id }) => {
      try {
        const relationship = await model.getRelationship(id);
        return {
          __typename: 'Relationship',
          ...relationship,
        };
      } catch (err) {
        return handleMandatoryEntity(err, `The relationship with the id "${id}" does not exist.`);
      }
    },
    contactList: () => model.allContact(),
    contact: async (_, { id }) => {
      try {
        const contact = await model.getContact(id);
        return {
          __typename: 'Contact',
          ...contact,
        };
      } catch (err) {
        return handleMandatoryEntity(err, `The contact with the id "${id}" does not exist.`);
      }
    },
  },
  Mutation: {
    addRelationship: async (_, { relationship }) => {
      try {
        const result = await model.createRelationship(relationship);
        return {
          __typename: 'Relationship',
          ...result,
        };
      } catch (err) {
        return handleBadUserInput(err);
      }
    },
    updateRelationship: async (_, { id, relationship }) => {
      try {
        const result = await model.updateRelationship(id, relationship);
        return {
          __typename: 'Relationship',
          ...result,
        };
      } catch (err) {
        return handleBadUserInput(err);
      }
    },
    removeRelationship: (_, { id }) => ({ success: model.removeRelationship(id), id }),
    addContact: async (_, { contact }) => {
      try {
        const result = await model.createContact(contact);
        return {
          __typename: 'Contact',
          ...result,
        };
      } catch (err) {
        return handleBadUserInput(err);
      }
    },
    updateContact: async (_, { id, contact }) => {
      try {
        const result = await model.updateContact(id, contact);
        return {
          __typename: 'Contact',
          ...result,
        };
      } catch (err) {
        return handleBadUserInput(err);
      }
    },
    removeContact: (_, { id }) => ({ success: model.removeContact(id), id }),
  },
  Relationship: {
    contactList: () => [],
  },
  Contact: {
    relationship: ({ relationshipId }) => model.getRelationship(relationshipId),
  },
};

module.exports = resolvers;
