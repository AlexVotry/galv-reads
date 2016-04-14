const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const medthodOverride = require('method-override');

const app = express();

function books() {
  return knex('books');
}

function authors() {
  return knex('authors');
}

app.use(medthodOverride('_method'));

/* GET books page. */
router.get('/', function(req, res, next) {
  authors().select().orderBy('authors.lname').then((people) => {
      books().select().then((records) => {
      res.render('authors/authors', { allBooks: records, allAuthors: people });
    });
  });
});

router.get('/new', (req, res, next) => {
  res.render('authors/new');
});

router.post('/authors', (req, res, next) => {
  authors().insert({ fname: req.body.fname, lname: req.body.lname, portrait: req.body.portrait, biography: req.body.biography }).then(() => {
    res.redirect('authors/authors');
  });
});

module.exports = router;
