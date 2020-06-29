exports.up = function up(knex) {
  return knex.schema.createTable('customers', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('email').notNullable();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('phone');
    table.string('mobile');
    table.timestamps(false, true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable('customers');
};
