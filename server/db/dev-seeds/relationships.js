const faker = require('faker');

const types = ['prospect', 'customer', 'business'];

exports.seed = async function seed(knex) {
  await knex('contacts').del();
  await knex('relationships').del();

  const relationshipIds = Array(50)
    .fill()
    .map(() => faker.random.uuid());

  await knex('relationships').insert(
    relationshipIds.map((id) => ({
      id,
      name: faker.company.companyName(),
      type: faker.random.arrayElement(types),
    })),
  );

  const relationshipIdsWithNulls = [...relationshipIds, ...Array(25).fill(null)];

  await knex('contacts').insert(
    Array(100)
      .fill()
      .map(() => ({
        id: faker.random.uuid(),
        relationshipId: faker.random.arrayElement(relationshipIdsWithNulls),
        email: faker.internet.email(),
        lastname: faker.name.lastName(),
        firstname: faker.name.firstName(),
      })),
  );
};
