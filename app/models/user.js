var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.users;

// User.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.password, 10, function (err, hash){
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   });
// });

User.methods = {
  encryptPassword: function (plainTextPassword) {
    return new Promise(function (resolve, reject) {
      if (!plainTextPassword) {
        resolve('err');
      }
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(plainTextPassword, salt);
      resolve(hash);
    });
  },
  comparePassword: function (attemptedPassword, userpassword, callback) {
    bcrypt.compare(attemptedPassword, userpassword, function (err, isMatch) {
      callback(isMatch);
    });
  }
};

console.log('User', User);

module.exports = User;




// console.log(db.models);


// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;

