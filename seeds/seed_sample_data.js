const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const bookPath = path.join(__dirname, 'sample_data.csv');

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('authors_books').del(),
    fs.readFile(bookPath, 'utf8', (err, data) => {
      if(err) {
        throw err;
      }
      var records = parse(data, {columns: true });
      knex('authors_books').insert(records),
    });

    // Inserts seed entries
    // knex('authors_books').insert({id: 2, colName: 'rowValue2'}),
    // knex('authors_books').insert({id: 3, colName: 'rowValue3'})
  );
};
