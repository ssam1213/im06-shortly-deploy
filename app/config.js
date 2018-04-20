const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var promise = mongoose.connect('mongodb://localhost/mydb', {
  useMongoClient: true
});

autoIncrement.initialize(promise);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('connected successfully');
});

const urlsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default:0}
});

urlsSchema.plugin(autoIncrement.plugin, 'urls');
var urls = mongoose.model('urls', urlsSchema);

// var newUrl = new Urls({
//   // url:'www.daum.com', 
//   // baseUrl:"www.asdasd.com"
// });

// newUrl.save(function(err, data){
//   if(err) {
//     return console.error(err);
//   } else {
//     console.log(data);
//   }
// });

const usersSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    trim: true
  },
  password: String,

});

// var newUsers = new Users({
//   username:'asda', 
//   password:"asdada"
// });
// newUsers.save(function(err, data){
//   if(err) {
//     return console.error(err);
//   } else {
//     console.log(data);
//   }
// });
// usersSchema.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.password, 10, function (err, hash){
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   });
// });
usersSchema.plugin(autoIncrement.plugin, 'users');
var users = mongoose.model('users', usersSchema);
module.exports = {urls, users};