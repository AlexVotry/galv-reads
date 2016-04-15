
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments('bid');
    table.string('title').unique();
    table.string('genre');
    table.text('description');
    table.string('cover');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
