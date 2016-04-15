const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

const app = express();

function books() {
  return knex('books');
}

function authors() {
  return knex('authors');
}
function authors_books() {
  return knex('authors_books');
}
function both() {
  return knex('books').select().join('authors_books', {'authors_books.books_id': 'books.bid'})
  .join('authors', {'authors.aid': 'authors_books.authors_id'});
}

/* GET authors page. */
router.get('/', function(req, res, next) {
  both().select().then((people)=> {
    res.render('authors/authors', { allAuthors: people });
  });
});

router.get('/new', (req, res, next) => {
  res.render('authors/new');
});

// go to isolation page to delete
router.get('/remove/:id', (req, res, next) => {
  authors().select().where({ aid: req.params.id }).first()
  .then((people) => {
      res.render('authors/remove', { theAuthor: people });
    });
  });

//set up edit page
router.get('/edit/:id', (req, res, next) => {
  both().where({ aid: req.params.id }).first().then((people) => {
    res.render('authors/edit', {title: 'Authors', theAuthor: people });
  });
});

router.post('/', (req, res, next) => {
  const bookId = books().insert({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    cover: req.body.cover
  }, 'bid');
  const author = authors().where('authors.lname', req.body.lname).pluck('aid').first();
  Promise.all([bookId, author]).then((data) => {
    if (!data[1]) {
      authors().insert({
        fname: req.body.fname,
        lname: req.body.lname,
        biography: req.body.biography,
        portrait: req.body.portrait
      }, 'aid').then((authorId) => {
        authors_books().insert({books_id: data[0][0], authors_id: authorId[0]}).then(() => {
          res.redirect('/authors');
        });
      });
    } else {
      authors_books().insert({books_id: data[0][0], authors_id: data[1].aid}).then(() => {
        res.redirect('/authors');
      }).catch((err) => {
        console.log(err);
      });
    };
  });
});

router.put('/:id', (req, res, next) => {
  authors().update({ fname: req.body.fname, lname: req.body.lname, biography: req.body.biography, portrait: req.body.portrait }).where({aid: req.params.id}).then(() => {
    res.redirect('/authors');
  });
});

router.delete('/:id', (req, res, next) => {
  authors().where({ aid: req.params.id }).del().then(() => {
    res.redirect('/authors')
  });
});

module.exports = router;
