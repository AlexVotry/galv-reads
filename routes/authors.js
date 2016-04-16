const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const models = require('../db/models');
const app = express();

/* GET authors page. */
router.get('/', function(req, res, next) {
  models.both().distinct('fname', 'lname', 'portrait', 'biography', 'aid').orderBy('lname').then((people)=> {
    res.render('authors/authors', { allAuthors: people });
  });
});

router.get('/new', (req, res, next) => {
  res.render('authors/new');
});

// go to isolation page to delete
router.get('/remove/:id', (req, res, next) => {
  models.authors().select().where({ aid: req.params.id }).first()
  .then((people) => {
      res.render('authors/remove', { theAuthor: people });
    });
  });

//set up edit page
router.get('/edit/:id', (req, res, next) => {
  models.both().where({ aid: req.params.id }).first().then((people) => {
    res.render('authors/edit', {title: 'Authors', theAuthor: people });
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
        biography: req.body.biography,
        portrait: req.body.portrait
      }, 'aid').then((authorId) => {
        models.ab().insert({books_id: data[0][0], authors_id: authorId[0]}).then(() => {
          res.redirect('/authors');
        });
      });
    } else {
      models.ab().insert({books_id: data[0][0], authors_id: data[1].aid}).then(() => {
        res.redirect('/authors');
      }).catch((err) => {
        console.log(err);
      });
    };
  });
});

router.put('/:id', (req, res, next) => {
  models.authors().update({ fname: req.body.fname, lname: req.body.lname, biography: req.body.biography, portrait: req.body.portrait }).where({aid: req.params.id}).then(() => {
    res.redirect('/authors');
  });
});

router.delete('/:aid/', (req, res, next) => {
  models.ab().where({ books_id: req.params.bid })
    .delete().then(()=> {
    models.authors().where({ aid: req.params.id }).del().then(() => {
      res.redirect('/books');
    });
  });
});

module.exports = router;
