const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const models = require('../db/models');
const app = express();
// router.post('/', (req, res, next)=> {
//   let const bookData = {
//     title: req.body.title,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover: req.body.cover
//   };
//   let const author Data = {
//     fname: req.body.fname,
//     lname: req.body.lname
//   };
//   Promise.all([createBook(bookData), findOrCreateAuthor(authorData)])
//   .then(createAuthorsBooks([bookId, authorId]) {
//     console.log([
//       "Created entry for book",
//       bookId,
//       "and author",
//       authorId,
//       "in authors_books."
//     ].join(" "));
//   }).catch(function(error) {
//     console.log(error);
//   });
// });
//
//   var createBook = (bookData) => {
//     models.books().insert(bookData)
//       .then(function(book) {
//         console.log(book[0]);
//         // console.log(book);
//         return book[0];
//       }).catch((error)=> {
//         console.log(error);
//       });
//   };
//
//   // returns a promise that resolves to an author_id
//   var findOrCreateAuthor = (authorData)=> {
//     models.authors()
//       .where({
//         fname: authorData.fname,
//         lname: authorData.lname
//       })
//       .then((author)=> {
//         let authorId;
//
//         if (author) then {
//           authorId = author.id;
//         } else {
//           authorId = createAuthor(authorData);
//         }
//
//         return authorId;
//       });
//   };
//
//   // returns a promise that resolves to an author_id
//   var createAuthor = (authorData)=> {
//     models.authors()
//       .insert(authorData)
//       .then((author)=> {
//         return author[0];
//       });
//   };
//
//   // returns a promise that resolves to an array containing [book_id, author_id]
//   // Note the "destructuring assigment" in the call to createAuthorsBooks
//   var createAuthorsBooks = ([bookId, authorId])=> {
//     models.ab()
//       .insert({ book_id: bookId, author_id: authorId })
//       .then(()=> {
//         return [bookId, authorId];  // ignore the return value from insert()!
//       });
//   };
// }
//
// router.post('/', (req, res, next)=> {
//   const bookData = {
//     title: req.body.title,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover: req.body.cover
//   };
//   const authorData = {
//     fname: req.body.fname,
//     lname: req.body.lname,
//     biography: req.body.biography,
//     portrait: req.body.portrait
//   };
//   Promise.all( [createBook(bookData), findOrCreateAuthor(authorData)] )
//   .then((bothId)=> {
//     console.log("BOTH ID: " + bothId);
//       // createAuthorsBooks(bookId, authorId);
//   }).then(() => {
//       res.redirect('/books')
//     }).catch(function(error) {
//         console.log('IS IT HERE?' + error);
//   });
//
//
//   function createBook(bookData) {
//     models.books().insert(bookData, 'bid')
//       .then((book)=> {
//         // console.log("BookData:" + JSON.stringify(bookData));
//          console.log("BOOK ID: " + book);
//         return book;
//       }).catch((error)=> {
//         console.log('I say the book already exists');
//       });
//   };
//
//   // returns a promise that resolves to an author_id
//   function findOrCreateAuthor(authorData) {
//     models.authors()
//       .where({
//         fname: authorData.fname,
//         lname: authorData.lname
//       })
//       .then((author)=> {
//         console.log('after select:' + JSON.stringify(author));
//         var authorId;
//
//       if (author[0]) {
//         console.log('if author already exists:');
//         console.log(author);
//         authorId = author[0].aid;
//         console.log("authorId New: " + authorId);
//       } else {
//         console.log('if author does not exist:');
//         next();
//         authorId = createAuthor(authorData);
//         console.log("authorId Exist: " + authorId);
//       }
//       console.log("authorId: LAST" + authorId);
//       return authorId;
//     });
//   };
//
//   // returns a promise that resolves to an author_id
//   function createAuthor(authorData) {
//     models.authors().insert(authorData, 'aid')
//       .then((author)=> {
//         console.log('INSERT AUTHOR ID: ' + author);
//         return author;
//       });
//   };
//
//   // returns a promise that resolves to an array containing [book_id, author_id]
//   // Note the "destructuring assigment" in the call to createAuthorsBooks
//   function createAuthorsBooks(bookId, authorId) {
//     models.ab()
//       .insert({ book_id: bookId, author_id: authorId })
//       .then(()=> {
//         return [bookId, authorId];  // ignore the return value from insert()!
//       });
//   };
// });


// router.post('/', (req, res, next) => {
//   const bookId = models.books().insert({
//     title: req.body.title,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover: req.body.cover
//   }, 'bid');
//
//   const author = models.authors().where('authors.lname', req.body.lname).pluck('aid').first();
//
//   Promise.all([bookId, author]).then((data) => {
//     if (!data[1]) {
//       models.authors().insert({
//         fname: req.body.fname,
//         lname: req.body.lname
//       }, 'aid').then((authorId) => {
//         models.ab().insert({
//           books_id: data[0][0],
//           authors_id: authorId[0]}).then(() => {
//           res.redirect('/books');
//         });
//       });
//     } else {
//       console.log(data[0][0]);
//       models.ab().insert({
//         books_id: data[0][0],
//         authors_id: data[1].aid
//       }).then(() => {
//         res.redirect('/books');
//       }).catch((err) => {
//         console.log(err);
//       });
//     };
//   });
// });


module.exports = router;
