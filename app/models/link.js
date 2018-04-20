var db = require('../config');
var crypto = require('crypto');
var Promise = require('bluebird');

var Link = db.urls;
// console.log('urls', Link);

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
Link.methods = {
  shorten: function (url) {
    var shasum = crypto.createHash('sha1');
    shasum.update(url);
    var shortLink = shasum.digest('hex').slice(0, 5);
    return shortLink;

  }

};
module.exports = Link;