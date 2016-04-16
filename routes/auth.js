const express = require('express');
const router = express.Router();
const Users = require('../models/users');

/* GET users listing. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin');
});

router.get('/logout', (req, res, next) => {
  req.session = null;
  res.redirect('/');
});

router.post('/signin', (req, res, next) => {
  Users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.render('auth/signin', {error: err});
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

module.exports = router;
