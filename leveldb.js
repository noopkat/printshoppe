var levelup = require('levelup');

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./ps-db', {valueEncoding: 'json'});

// 2) put a key & value
// db.put('name', 'LevelUP', function (err) {
//   if (err) return console.log('Ooops!', err) // some kind of I/O error

//   // 3) fetch by key
// //   db.get('name', function (err, value) {
// //     if (err) return console.log('Ooops!', err) // likely the key was not found

// //   })
// // })

db.batch()
  .put('job~01', {
    'email': 'suz@noopkat.com',
    'files': [['thing:13505', 2], ['thing:152484', 1]],
    'message': 'only the first file for 8903 please',
    'status': 'pending'
  })
  .put('job~02', {
    'email': 'elijah@noopkat.com',
    'files': [['thing:13505', 1], ['thing:152484', 6]],
    'message': 'all files to be printed',
    'status': 'printing'
  })
  .put('job~03', {
    'email': 'richard@noopkat.com',
    'files': [['thing:13505', 3], ['thing:152484', 5]],
    'message': 'first file of each',
    'status': 'done'
  })
  .put('job~04', {
    'email': 'lisa@noopkat.com',
    'files': [['thing:13505', 2], ['thing:152484', 2]],
    'message': 'second file of each',
    'status': 'cancelled'
  })
  .put('~counter', 4)
  .write(function() {
    console.log('Done!');
    db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value);
    });
 });