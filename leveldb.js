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
  .put('job~1', {
    'email': 'suz@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'only the first file for 8903 please',
    'status': 'pending'
  })
  .put('job~2', {
    'email': 'elijah@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'all files to be printed',
    'status': 'printing'
  })
  .put('job~3', {
    'email': 'richard@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'first file of each',
    'status': 'done'
  })
  .put('job~4', {
    'email': 'lisa@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'second file of each',
    'status': 'cancelled'
  })
  .write(function() {
    console.log('Done!');
    db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value);
    });
 });