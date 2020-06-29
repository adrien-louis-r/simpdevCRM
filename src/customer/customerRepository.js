const uuid = require('uuid');
const db = require('../db');

async function all() {
  return db('customers');
}

async function find(id) {
  const rows = await db('customers').where('id', id);
  return rows[0];
}

async function create(payload) {
  const rows = await db('customers')
    .insert({
      id: uuid.v4(),
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
  const rows = await db('customers')
    .where('id', id)
    .update({
      email: payload.email,
      lastname: payload.lastname,
      firstname: payload.firstname,
      phone: payload.phone,
      mobile: payload.mobile,
    })
    .returning('*');

  return rows[0];
}

module.exports = { all, find, create, update };
