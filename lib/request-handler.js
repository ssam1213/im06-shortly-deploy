var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
// var User = require('mongoose').model('users');

var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function (req, res) {
  res.render('index');
};

exports.signupUserForm = function (req, res) {
  res.render('signup');
};

exports.loginUserForm = function (req, res) {
  res.render('login');
};

exports.logoutUser = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/login');
  });
};

exports.fetchLinks = function (req, res) {
  Link.find().then(function (links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function (req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({
    url: uri
  }).then(function (found) {
    console.log('found', found);
    if (found) {
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.code = Link.methods.shorten(uri);
        newLink.save().then(() => {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({
      username: username
    })
    .then(function (user) {
      if (user.length === 0) {
        res.redirect('/login');
      } else {
        User.methods.comparePassword(password, user[0].password, function (match) {
          if (match) {
            console.log('user', user[0]);
            util.createSession(req, res, user[0]);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function (req, res) {
  console.log('req.body', req.body);

  var username = req.body.username;
  var password = req.body.password;
  User.methods.encryptPassword(password).then(function (hash) {
    User.find({
      username: username
    }).then(function (user) {
      if (user.length === 0) {
        var newUser = new User({
          username: username,
          password: hash
        });
        newUser.save().then(function (err, newUser) {
          if (err) {
            return console.log(err);
          } else {
            util.createSession(req, res, newUser);
          }
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
  });
};

exports.navToLink = function (req, res) {
  Link.find({
    code: req.params[0]
  }).then(function (link) {
    if (link.length === 0) {
      res.redirect('/');
    } else {
      link[0].visits++;
      link[0].save().then(function() {
        res.redirect(link[0].url);
      });
 
    }
  });
};