var levelup = require('levelup');
var db = levelup('./ps-db', {valueEncoding: 'json'});

/* just creating test data to play with */

db.batch()
  .put('job~01', {
    'date': '1417333156587',
    'email': 'suz@noopkat.com',
    'files': [['thing:13505', 2], ['thing:152484', 1]],
    'message': 'only the first file for 8903 please',
    'status': 'pending'
  })
  .put('job~02', {
    'date': '1417337616631',
    'email': 'elijah@noopkat.com',
    'files': [['thing:13505', 1], ['thing:152484', 6]],
    'message': 'all files to be printed',
    'status': 'printing'
  })
  .put('job~03', {
    'date': '1417333730968',
    'email': 'richard@noopkat.com',
    'files': [['thing:13505', 3], ['thing:152484', 5]],
    'message': 'first file of each',
    'status': 'done'
  })
  .put('job~04', {
    'date': '1417333845039',
    'email': 'lisa@noopkat.com',
    'files': [['thing:13505', 2], ['thing:152484', 2]],
    'message': 'second file of each',
    'status': 'cancelled'
  })
  // counter for auto incrementing key module
  .put('~counter', 4)
  .write(function() {
    console.log('Done!');
    db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value);
    });
 });