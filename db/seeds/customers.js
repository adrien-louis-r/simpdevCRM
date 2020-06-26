exports.seed = async function seed(knex) {
  await knex('customers').del();

  return knex('customers').insert([
    { email: 'jane.doe@example.com', lastname: 'Doe', firstname: 'Jane' },
    { email: 'John.Doe@example.com', lastname: 'Doe', firstname: 'John' },
  ]);
};
