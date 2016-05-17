const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const models = require('../db/models');
const app = express();
const request = require('request');

router.get('/', function(req, res, next) {
  models.both().distinct('title', 'fname', 'lname', 'genre', 'description', 'cover', 'bid', 'aid').select().orderBy('title').then((book)=> {
    res.render('books/books', { allBooks: book});
  });
});

router.get('/new', (req, res, next) => {
      res.render('books/new');
});

router.get('/new/title', (req, res, next) => {
  var val = req.query.title;
  console.log(val);
   models.books().pluck('title').where('books.title', val).first().then((book)=> {
    console.log('book title: ' + book);
      // body = JSON.parse(body);
      console.log(book);
      if(!book) {
        next();
      } else {
        res.send("we have that book!");
      }
  });
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
  models.books().pluck('title').where('books.title', req.body.title).first()
  .then((btitle) => {
    if (!btitle) {
      next();
    } else {
      res.send('We have that book!')
    }
  })
});

// why isn't this post to '/new'
router.post('/', (req, res, next) => {
  const bookId = models.books().insert({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    cover: req.body.cover
  }, 'bid');

  // const author = function() {
  //   models.authors().where('authors.lname', req.body.lname)
  //   .pluck('aid').first().then(aId => {
  //     if (aId) {
  //       return [aId.aid]
  //     }
  //   }) else {
  //     models.authors().insert({
  //       fname: req.body.fname,
  //       lname: req.body.lname,
  //     }, 'aid');
  //   };
  // };

  const author = models.authors().where('authors.lname', req.body.lname)
    .pluck('aid').first().then(aId => {
      if (aId == undefined) {
        console.log('undefined author: ' + aId);
        // models {
        //   authors: function() {
        //     returns knex('authors');
        //   }
        // }

        // models.authors() === knex('authors');
        
        var authors = models.authors();
        return authors.insert({
          fname: req.body.fname,
          lname: req.body.lname,
        }, 'aid'); // has correct result, just won't pass to Promise.all
        //   .then((newAuthor)=> {
        //   console.log(newAuthor);
        //   return newAuthor;
        // });
        } else {
          console.log('const author: ' + aId.aid);
          return [aId.aid];
      };
    }).catch((err) => {
      console.log("author error: " + err);
    });

  Promise.all([bookId, author]).then((data) => {
    const thisBook = data[0][0];
    const thisAuthor = data[1][0];
    console.log('author data: ' + JSON.stringify(data));
      console.log('existingAuthor: ' + thisAuthor + ' book:' + thisBook);
      models.ab().insert({
        books_id: thisBook,
        authors_id: thisAuthor
      }).then(() => {
        res.redirect('/books');
      }).catch((err) => {
        console.log(err);
      });
  });
});

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
