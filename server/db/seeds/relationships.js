exports.seed = async function seed(knex) {
  await knex('contacts').del();
  await knex('relationships').del();

  await knex('relationships').insert([
    {
      id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
      name: 'Promising contact',
      type: 'prospect',
    },
    {
      id: 'dbd4666a-92df-47b5-82d3-9163c4875db9',
      name: 'Nice customer',
      type: 'customer',
    },
    {
      id: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
      name: 'Friendly freelance',
      type: 'business',
    },
  ]);

  await knex('contacts').insert([
    {
      id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
      relationshipId: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
      email: 'jane.doe@example.com',
      lastname: 'Doe',
      firstname: 'Jane',
    },
    {
      id: '5f51285e-c510-436b-b06c-a16bec51a92c',
      relationshipId: 'dbd4666a-92df-47b5-82d3-9163c4875db9',
      email: 'John.Doe@example.com',
      lastname: 'Doe',
      firstname: 'John',
    },
    {
      id: 'e64c1b18-7b70-4a76-b733-250abb6238d8',
      email: 'GoodAcme@example.com',
      lastname: 'Acme',
      firstname: 'Good',
    },
  ]);
};
