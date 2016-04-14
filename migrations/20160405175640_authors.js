
exports.up = function(knex, Promise) {
  return knex.schema.createTable ('authors', function(table) {
    table.increments();
    table.string('fname');
    table.string('lname');
    table.text('biography');
    table.string('portrait');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors');
};
