var levelup = require('levelup');
var db = levelup('./ps-db', {valueEncoding: 'json'});
var JSONStream = require('JSONStream');
var range = require('level-range');
require('level-autotable')(db);
var concat = require('concat-stream');

db.initAutoKeys();

var prefix = 'job~';

module.exports.getAllJobs = function getAllJobs(callback) {
  range(db, 'job~')
    .on('error', callback)
    .pipe(concat(function(buffer) {
      var jobs = JSON.parse(buffer.toString());
      callback(null, jobs);
    });
}

module.exports.createJob = function createJob(data, callback) {
  var key;
  db.newAutoKey(function(err, newKey) {
    if (newKey < 10) newKey = '0' + newKey;
    console.log('autokey:', newKey);
    key = prefix + newKey;
    db.putRecord(key, data, function(err) {
      callback(err);
    });
  }); 
}

module.exports.changeJobState = function changeJobState(key, state, callback) {
  db.putField(key, 'state', state, {}, function(err) {
    callback(err);
  });
}

function editJob(callback) {
  
}

function deleteJob(callback) {

}