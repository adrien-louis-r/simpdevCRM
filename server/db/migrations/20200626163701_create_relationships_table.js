exports.up = async function up(knex) {
  await knex.schema.createTable('relationships', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.enu('type', ['business', 'prospect', 'customer']).notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('contacts', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('relationshipId').references('id').inTable('relationships').onDelete('SET NULL');
    table.string('email').notNullable();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('phone');
    table.string('mobile');
    table.timestamps(false, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('contacts');
  await knex.schema.dropTable('relationships');
};
