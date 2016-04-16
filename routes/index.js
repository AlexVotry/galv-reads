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

/* GET home page. */
router.get('/', function(req, res, next) {
  books().select().then((records) => {
    authors().select().then((people) => {
      res.render('index', { title: 'Galvanize Book Library', allBooks: records, allAuthors: people });
    })
  });
});

module.exports = router;
