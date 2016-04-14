const express = require('express');
const router = express.Router();
const knex = require('../db/knex');


const app = express();

function books() {
  return knex('books');
};

function authors() {
  return knex('authors');
};

function authors_books() {
  return knex('authors_books');
};



// GET books page
router.get('/', function(req, res, next) {
  books().then((records) => {
    res.render('books/books', { allBooks: records });
  });
});

router.get('/new', (req, res, next) => {
  res.render('books/new');
});

// go to isolation page to delete
router.get('/remove/:id', (req, res, next) => {
  books().where({ id: req.params.id }).first()
  .then((record) => { authors().where ({ id: req.params.id })
    .then((val) => {
      res.render('books/remove', { theBook: record, theAuthor: val });
    });
  });
});

//set up edit page
router.get('/edit/:id', (req, res, next) => {
  books().where({ id: req.params.id }).first().then((record) => {
    res.render('books/edit', {title: 'Books', theBook: record });
  });
});

router.post('/', (req, res, next) => {
  const book = books().insert({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    cover: req.body.cover
  }, 'id');

  // const author = authors().where('lname', req.body.lname).pluck('id').first();

  const newAuthor = authors().insert({
    fname: req.body.fname,
    lname: req.body.lname,
    biography: req.body.biography,
    portrait: req.body.portrait
  }, 'id');

  // if(author) {
  //   authors_books().insert( {books_id: book, authors_id: author} ).then(() => {
  //     console.log('author' + ' ' + book, author);
  //     res.redirect('/books');
  //   });
  // } else {
    authors_books().insert( {books_id: book, authors_id: newAuthor }).then(() => {
      console.log('new author' + ' ' + book, newAuthor);
      res.redirect('/books').catch((err) => {
        console.log(err);
      });
    });
  // }

});
//   books().insert({
//     title: req.body.title,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover: req.body.cover
//   }).then(() => {
//     res.redirect('/books');
//   })
//     .catch((err) => {
//     console.log(err)
//   });
// });

router.put('/:id', (req, res, next) => {
  books().update({ title: req.body.title, genre: req.body.genre, description: req.body.description }).where({id: req.params.id}).then(() => {
    res.redirect('/books');
  });
});

router.delete('/:id', (req, res, next) => {
  books().where({ id: req.params.id }).del().then(() => {
    res.redirect('/books')
  });
});

module.exports = router;
