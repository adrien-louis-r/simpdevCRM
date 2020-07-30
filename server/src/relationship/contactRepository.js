const uuid = require('uuid');
const db = require('../db');
const { NoSuchEntity } = require('../errors');

async function all() {
  return db('contacts');
}

async function get(id) {
  const rows = await db('contacts').where('id', id);
  if (!rows[0]) {
    throw new NoSuchEntity();
  }
  return rows[0];
}

async function create(payload) {
  const rows = await db('contacts')
    .insert({
      id: uuid.v4(),
      relationshipId: payload.relationshipId,
      email: payload.email,
      lastname: payload.lastname,
      firstname: payload.firstname,
      phone: payload.phone,
      mobile: payload.mobile,
    })
    .returning('*');

  return rows[0];
}

async function update(id, payload) {
  const rows = await db('contacts')
    .where('id', id)
    .update({
      relationshipId: payload.relationshipId,
      email: payload.email,
      lastname: payload.lastname,
      firstname: payload.firstname,
      phone: payload.phone,
      mobile: payload.mobile,
    })
    .returning('*');

  return rows[0];
}

async function remove(id) {
  await db('contacts').where('id', id).delete();
  return true;
}

module.exports = {
  all,
  get,
  create,
  update,
  remove,
};
