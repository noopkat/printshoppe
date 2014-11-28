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

// //   db.put('hello', 'is it me you\'re looking for?', function() {

// //     db.createReadStream()
// //     .on('data', function (data) {
// //       console.log(data.key, '=', data.value)
// //     });
  
// })

// db.batch()
//   .del('name')
//   .put('job~1~email', 'suz@noopkat.com')
//   .put('job~1~files', 'thing:13505,thing:152484')
//   .put('job~1~message', 'only the first file for 8903 please')
//   .put('job~1~status', 'pending')
//   .put('job~1~printer', 'TAZ-1')
//   .put('printer~1~port', '5000')
//   .put('printer~1~name', 'TAZ-1')
//   .write(function () { console.log('Done!') });

//   db.createReadStream()
//     .on('data', function (data) {
//       console.log(data.key, '=', data.value)
//     });

db.put('job~1', {
    'email': 'suz@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'only the first file for 8903 please',
    'status': 'pending'
  });

  db.put('job~2', {
    'email': 'elijah@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'all files to be printed',
    'status': 'printing'
  })
  db.put('job~3', {
    'email': 'richard@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'first file of each',
    'status': 'done'
  })
  db.put('job~4', {
    'email': 'lisa@noopkat.com',
    'files': ['thing:13505', 'thing:152484'],
    'message': 'second file of each',
    'status': 'cancelled'
  })
  

  db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value);
    });

//db.put('job~1~date', '1409113079');

    // db.createReadStream()
    // .on('data', function (data) {
    //   console.log(data.key, '=', data.value)
    // });
  
//})