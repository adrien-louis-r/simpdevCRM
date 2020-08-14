const joi = require('@hapi/joi');
const { InvalidParam } = require('../errors');
const contactRepository = require('./contactRepository');
const relationshipRepository = require('./relationshipRepository');

function guardAgainstInvalidId(id) {
  const result = joi.string().guid().validate(id);
  if (result.error) {
    throw new InvalidParam('Not found');
  }
}

const contactValidator = joi.object({
  relationshipId: joi.string().guid(),
  email: joi.string().email().required(),
  firstname: joi.string().min(2).required(),
  lastname: joi.string().min(2).required(),
});

const relationshipValidator = joi.object({
  name: joi.string().min(2).required(),
  type: joi.string().valid('business', 'prospect', 'customer').required(),
});

async function listContact(params) {
  return contactRepository.list(params);
}

async function getContact(id) {
  guardAgainstInvalidId(id);
  return contactRepository.get(id);
}

async function createContact(payload) {
  const value = await contactValidator.validateAsync(payload, {
    abortEarly: false,
  });

  return contactRepository.create(value);
}

async function updateContact(id, payload) {
  guardAgainstInvalidId(id);
  const value = await contactValidator.validateAsync(payload, {
    abortEarly: false,
  });

  return contactRepository.update(id, value);
}

async function removeContact(id) {
  guardAgainstInvalidId(id);
  await joi.string().guid().validate(id);
  return contactRepository.remove(id);
}

async function listRelationship(params) {
  return relationshipRepository.list(params);
}

async function getRelationship(id) {
  guardAgainstInvalidId(id);
  return relationshipRepository.get(id);
}

async function createRelationship(payload) {
  const value = await relationshipValidator.validateAsync(payload, {
    abortEarly: false,
  });

  return relationshipRepository.create(value);
}

async function updateRelationship(id, payload) {
  guardAgainstInvalidId(id);
  const value = await relationshipValidator.validateAsync(payload, {
    abortEarly: false,
  });

  return relationshipRepository.update(id, value);
}

async function removeRelationship(id) {
  guardAgainstInvalidId(id);
  await joi.string().guid().validateAsync(id);
  return relationshipRepository.remove(id);
}

module.exports = {
  listContact,
  getContact,
  createContact,
  updateContact,
  removeContact,
  listRelationship,
  getRelationship,
  createRelationship,
  updateRelationship,
  removeRelationship,
};
