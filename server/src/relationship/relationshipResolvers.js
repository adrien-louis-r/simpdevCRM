const model = require('./relationshipModel');
const { NoSuchEntity, InvalidParam } = require('../errors');

function formatValidationErrors(err) {
  return err.details.map((detail) => {
    return {
      field: detail.context.key || detail.context.label,
      message: detail.message,
    };
  });
}

function handleErrors(err, handlers) {
  const returnValue = handlers.reduce((acc, handler) => {
    const isHandled = handler(err);
    if (isHandled) {
      return isHandled;
    }

    return acc;
  }, null);

  if (!returnValue) {
    throw err;
  }

  return returnValue;
}

const handleNoSuchEntity = (err, message) => () => {
  if (!(err instanceof NoSuchEntity)) {
    return false;
  }

  return {
    __typename: 'NotFoundEntity',
    message,
  };
};

const handleInvalidParam = (err, message) => () => {
  if (!(err instanceof InvalidParam)) {
    return false;
  }

  return {
    __typename: 'InvalidParam',
    message,
  };
};

const handleBadUserInput = (err) => () => {
  if (err.name !== 'ValidationError') {
    return false;
  }

  return {
    __typename: 'BadUserInput',
    errors: formatValidationErrors(err),
  };
};

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
        return handleErrors(err, [
          handleNoSuchEntity(err, `The relationship with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The relationship with the id "${id}" does not exist.`),
        ]);
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
        return handleErrors(err, [
          handleNoSuchEntity(err, `The contact with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The contact with the id "${id}" does not exist.`),
        ]);
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
        return handleErrors(err, [handleBadUserInput(err)]);
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
        return handleErrors(err, [
          handleNoSuchEntity(err, `The relationship with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The relationship with the id "${id}" does not exist.`),
          handleBadUserInput(err),
        ]);
      }
    },
    removeRelationship: async (_, { id }) => {
      try {
        const success = await model.removeRelationship(id);
        return {
          __typename: 'DeleteResult',
          id,
          success,
        };
      } catch (err) {
        return handleErrors(err, [
          handleNoSuchEntity(err, `The relationship with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The relationship with the id "${id}" does not exist.`),
        ]);
      }
    },
    addContact: async (_, { contact }) => {
      try {
        const result = await model.createContact(contact);
        return {
          __typename: 'Contact',
          ...result,
        };
      } catch (err) {
        return handleErrors(err, [handleBadUserInput(err)]);
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
        return handleErrors(err, [
          handleNoSuchEntity(err, `The contact with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The contact with the id "${id}" does not exist.`),
          handleBadUserInput(err),
        ]);
      }
    },
    removeContact: async (_, { id }) => {
      try {
        const success = await model.removeContact(id);
        return {
          __typename: 'DeleteResult',
          id,
          success,
        };
      } catch (err) {
        return handleErrors(err, [
          handleNoSuchEntity(err, `The contact with the id "${id}" does not exist.`),
          handleInvalidParam(err, `The contact with the id "${id}" does not exist.`),
        ]);
      }
    },
  },
  Relationship: {
    contactList: () => [],
  },
  Contact: {
    relationship: ({ relationshipId }) => model.getRelationship(relationshipId),
  },
};

module.exports = resolvers;
