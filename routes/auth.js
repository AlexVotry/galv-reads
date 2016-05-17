const express = require('express');
const router = express.Router();
const Users = require('../db/models');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('login', { user: req.user });
});
// app.get('/', function(req, res){
//   res.render('index', { user: req.user });
// });

router.get('/logout', (req, res, next) => {
  req.user = null;
  res.redirect('/');
});


router.get('/', Users.ensureAuthenticated, function(req, res){
  res.render('login', { user: req.user });
});

// router.post('/signin', (req, res, next) => {
//   Users.ensureAuthenticated(req.body.email, req.body.password, (err, user) => {
//     if (err) {
//       res.render('auth/signin', {error: err});
//     } else {
//       req.session.user = user;
//       res.redirect('/');
//     }
//   });
// });

module.exports = router;
