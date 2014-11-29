var levelup = require('levelup');
var db = levelup('./ps-db', {valueEncoding: 'json'});
var JSONStream = require('JSONStream');
var range = require('level-range');
require('level-autotable')(db);
var concat = require('concat-stream');

db.initAutoKeys(function() {});

var prefix = 'job~';

module.exports.getAllJobs = function getAllJobs(callback) {
  range(db, 'job~')
    .on('error', callback)
    .pipe(concat(function(buffer) {
      var jobs = JSON.parse(JSON.stringify(buffer));
      var jobsData = [];
      for (var i = 0; i < jobs.length; i ++) {
        jobs[i].value.key = jobs[i].key;
        jobsData.push(
          jobs[i].value
        );
      }
      callback(null, JSON.stringify(jobsData));
    }));
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

module.exports.changeJobStatus = function changeJobStatus(key, state, callback) {
  db.putField(key, 'state', state, {}, function(err) {
    callback(err);
  });
}

function editJob(callback) {
  
}

function deleteJob(callback) {

}