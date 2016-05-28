'use strict';

const express = require('express');
const knex = require('./db/knex');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const index = require('./routes/index')
const users = require('./routes/users');
const books = require('./routes/books');
const authors = require('./routes/authors');
const medthodOverride = require('method-override');
const passport = require('passport');
// const RedisStore = require('connect-redis');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express();
require('dotenv').load();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.Host + '/auth/google/callback',
  scope: ['https://www.googleapis.com/auth/plus.login'],
  passReqToCallback : true,
  state: true
},
  function(request, accessToken, refreshToken, profile, done) {
    return knex('users').where({ pass: profile.id }).first().then((user) => {
      if (!user) {
        knex('users').insert({
        name: profile.displayName,
        pass: profile.id,
      }, '*').then(newUser => {
        return done(null, newUser);
      });
    } else {
        return done(null, profile);
      }
    });
}));

passport.serializeUser((user, done)=> {
  done(null, user);
});

passport.deserializeUser((obj, done)=> {
  done(null, obj);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name: 'webClient2',
  keys: [process.env.SESSION_KEY]
}));
app.use(express.static('public'));
app.use(medthodOverride('_method'));
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/books', books);
app.use('/authors', authors);
app.use('/index', index);
app.use('/users', users);

app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.me']
}));

app.get( '/auth/google/callback',
    	passport.authenticate( 'google', {
    		successRedirect: '/index',
    		failureRedirect: '/'
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
