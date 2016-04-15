
exports.up = function(knex, Promise) {
  return knex.schema.createTable ('authors', function(table) {
    table.increments('aid');
    table.string('fname');
    table.string('lname').unique();
    table.text('biography');
    table.string('portrait');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors');
};
