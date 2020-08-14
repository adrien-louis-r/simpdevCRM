const uuid = require('uuid');
const db = require('./db');
const { NoSuchEntity } = require('./errors');

function guardAgainstMissingEntity(entity) {
  if (!entity) {
    throw new NoSuchEntity();
  }
}

function makeList(table) {
  return async function list({ size = 10, from = 0 }) {
    const total = await db(table).count();
    const items = await db(table).offset(from).limit(size);

    return { total: total[0].count, items };
  };
}

function makeGet(table) {
  return async function get(id) {
    const rows = await db(table).where('id', id);
    guardAgainstMissingEntity(rows[0]);
    return rows[0];
  };
}

function makeCreate(table) {
  return async function create(payload) {
    const rows = await db(table)
      .insert({
        id: uuid.v4(),
        ...payload,
      })
      .returning('*');

    return rows[0];
  };
}

function makeUpdate(table) {
  return async function update(id, payload) {
    const rows = await db(table).where('id', id).update(payload).returning('*');
    guardAgainstMissingEntity(rows[0]);
    return rows[0];
  };
}

function makeRemove(table) {
  return async function remove(id) {
    await makeGet(table)(id);
    const result = await db(table).where('id', id).delete();
    return Boolean(result);
  };
}

module.exports = (tablename) => ({
  list: makeList(tablename),
  get: makeGet(tablename),
  create: makeCreate(tablename),
  update: makeUpdate(tablename),
  remove: makeRemove(tablename),
});
