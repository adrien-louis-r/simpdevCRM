const uuid = require('uuid');
const db = require('../db');
const { NoSuchEntity } = require('../errors');

async function all() {
  return db('relationships');
}

async function get(id) {
  const rows = await db('relationships').where('id', id);
  if (!rows[0]) {
    throw new NoSuchEntity();
  }
  return rows[0];
}

async function create(payload) {
  const rows = await db('relationships')
    .insert({
      id: uuid.v4(),
      name: payload.name,
      type: payload.type,
    })
    .returning('*');

  return rows[0];
}

async function update(id, payload) {
  const rows = await db('relationships')
    .where('id', id)
    .update({
      name: payload.name,
      type: payload.type,
    })
    .returning('*');

  if (!rows[0]) {
    throw new NoSuchEntity();
  }

  return rows[0];
}

async function remove(id) {
  await get(id);
  const result = await db('relationships').where('id', id).delete();
  return Boolean(result);
}

module.exports = {
  all,
  get,
  create,
  update,
  remove,
};
