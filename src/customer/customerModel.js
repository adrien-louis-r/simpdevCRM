const db = require('../db');

async function all() {
  return db('customers');
}

async function find(id) {
  return db('customers')
    .where('id', id)
    .then((rows) => rows[0]);
}

module.exports = { all, find };
