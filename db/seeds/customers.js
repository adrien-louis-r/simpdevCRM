exports.seed = async function seed(knex) {
  await knex('customers').del();

  return knex('customers').insert([
    {
      id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
      email: 'jane.doe@example.com',
      lastname: 'Doe',
      firstname: 'Jane',
    },
    {
      id: '5f51285e-c510-436b-b06c-a16bec51a92c',
      email: 'John.Doe@example.com',
      lastname: 'Doe',
      firstname: 'John',
    },
  ]);
};
