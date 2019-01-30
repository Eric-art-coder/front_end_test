var path = require('path');
var Datastore = require('nedb');

var db = new Datastore({
  autoload: true,
  filename: path.resolve(__dirname, '..', 'datastore.txt')
});

module.exports = db;
