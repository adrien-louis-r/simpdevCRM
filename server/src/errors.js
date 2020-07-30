const { ApolloError } = require('apollo-server');

class NoSuchEntity extends ApolloError {
  constructor(message, properties) {
    super(message, 'NO_SUCH_ENTITY', properties);
  }
}

class InvalidParam extends ApolloError {
  constructor(message, properties) {
    super(message, 'INVALID_PARAM', properties);
  }
}

module.exports = { NoSuchEntity, InvalidParam };
