const knex = require('./knex');

module.exports = {
  books: function books() {
    return knex('books');
  },
  authors: function authors() {
    return knex('authors');
  },

  ab: function authors_books() {
    return knex('authors_books');
  },

  both: function both() {
    return knex('books').join('authors_books', {'authors_books.books_id': 'books.bid'})
    .join('authors', {'authors.aid': 'authors_books.authors_id'});
  }

}
