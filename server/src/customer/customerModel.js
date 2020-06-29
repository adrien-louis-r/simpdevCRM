const joi = require('@hapi/joi');
const { UserInputError } = require('apollo-server');
const repository = require('./customerRepository');

function formatValidationErrors(err) {
  const validationErrors = err.details.reduce((acc, detail) => {
    acc[detail.context.key] = detail.message;
    return acc;
  }, {});

  throw new UserInputError('Failed to create user to validation errors', { validationErrors });
}

const schema = joi.object({
  email: joi.string().email().required(),
  firstname: joi.string().min(2).required(),
  lastname: joi.string().min(2).required(),
});

async function all() {
  return repository.all();
}

async function find(id) {
  return repository.find(id);
}

async function create(payload) {
  try {
    const value = await schema.validateAsync(payload, {
      abortEarly: false,
    });

    return repository.create(value);
  } catch (err) {
    return formatValidationErrors(err);
  }
}

async function update(id, payload) {
  try {
    const value = await schema.validateAsync(payload, {
      abortEarly: false,
    });

    return repository.update(id, value);
  } catch (err) {
    return formatValidationErrors(err);
  }
}

module.exports = {
  all,
  find,
  create,
  update,
};
