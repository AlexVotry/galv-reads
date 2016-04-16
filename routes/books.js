const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const models = require('../db/models');
const app = express();

router.get('/', function(req, res, next) {
  models.both().distinct('title', 'fname', 'lname', 'genre', 'description', 'cover', 'bid', 'aid').select().orderBy('title').then((book)=> {
    res.render('books/books', { allBooks: book});
  });
});

router.get('/new', (req, res, next) => {
  res.render('books/new');
});

// go to isolation page to delete
router.get('/remove/:bid/', (req, res, next) => {
  models.both().select().where({ bid: req.params.bid }).first()
  .then((book) => {
    res.render('books/remove', { theBook: book });
  });
});


//set up edit page
router.get('/edit/:id', (req, res, next) => {
  models.both().where({ bid: req.params.id }).first().then((record) => {
    res.render('books/edit', {title: 'Books', theBook: record });
  });
});

router.post('/', (req, res, next) => {
  const bookId = models.books().insert({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    cover: req.body.cover
  }, 'bid');
  const author = models.authors().where('authors.lname', req.body.lname).pluck('aid').first();
  Promise.all([bookId, author]).then((data) => {
    if (!data[1]) {
      models.authors().insert({
        fname: req.body.fname,
        lname: req.body.lname,
      }, 'aid').then((authorId) => {
        models.ab().insert({
          books_id: data[0][0],
          authors_id: authorId[0]}).then(() => {
          res.redirect('/books');
        });
      });
    } else {
      console.log(data[0][0]);
      models.ab().insert({
        books_id: data[0][0],
        authors_id: data[1].aid
      }).then(() => {
        res.redirect('/books');
      }).catch((err) => {
        console.log(err);
      });
    };
  });
});

// router.put('/:id', (req, res, next) => {
//   const bookId = req.params.id;
//   const book = models.books().update({
//     title: req.body.title,
//     genre: req.body.genre,
//     description: req.body.description
//   }).where({ bid: bookId });
//
//   const author = models.authors().pluck('aid').where( { lname: req.body.lname }).first();
//
//   Promise.all([book, author]).then((data)=> {
//     const authorsId = data[1];
//     if (!authorsId) {
//       models.authors().insert({
//         fname: req.body.fname,
//         lname: req.body.lname
//       }, 'aid').then((authorId)=> {
//         models.ab().where({
//           books_id: bookId
//         }).update({
//           authors_id: authorId[0]
//         }).then(() => {
//           res.redirect('/books');
//         });
//       });
//     } else {
//       console.log('else: ' + book);
//       models.ab().where({
//         books_id: bookId
//       }).then((abId) => {
//         models.ab().update({
//           authors_id: authorsId
//         }).first().then(()=> {
//           res.redirect('/books');
//         }).catch((err) => {
//           console.log(err);
//         });
//       });
//     };
//   });
// });
router.put('/:id', (req, res, next) => {
  models.books().update({
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description
    }).where({ bid: req.params.id }).then(() => {
    res.redirect('/books');
  });
});
router.delete('/:bid/', (req, res, next) => {
  models.ab().where({ books_id: req.params.bid })
    .delete().then(()=> {
    models.books().where({ bid: req.params.id }).del().then(() => {
      res.redirect('/books');
    });
  });
});

module.exports = router;
