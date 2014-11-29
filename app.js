var config = require('./config');
var https = require('https');
var dataHelpers = require('./dataHelpers');
var io;

// set up access to socket and initial socket subs
module.exports.setupSocket = function setupSocket(iosocket) {
  io = iosocket;
  io.on('connection', function(socket) {
      socket.emit('server ready');

      socket.on('job:change:status', function(data) {
        console.log('state change for', data.key, 'to', data.status);
        dataHelpers.changeJobStatus(data.key, data.status, function(err) {
          socket.broadcast.emit('job:change:status:done', data);
          console.log(err);
        });
     });
  });
};

// hit github api and get organisation of authenticated user
module.exports.getOrg = function getOrg(username, fn) {

  var options = {
    hostname: 'api.github.com',
    path: '/users/' + username + '/orgs',
    port : 443,
    method : 'GET',
    headers: {'User-Agent': config.userAgent}
  };

  var reqGet = https.request(options, function(res) {
    var datastring = '';
    res.on('data', function(d) {
        datastring += d;
    });

    res.on('end', function() {
      fn(null, JSON.parse(datastring));
    }); 
  });

  reqGet.on('error', function(e) {
    console.error('github is sad: '+e);
  }); 
  reqGet.end();
};

// /login handler for view
module.exports.loginHandler = function loginHandler(request, reply) {
  //console.log(request.auth.credentials);
  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed due to: ' + request.auth.error.message);
  }

  var username = request.auth.credentials.profile.username;

  // make sure the auth'd user is in the printshoppe org, otherwise lock em out
  getOrg(username, function(e, obj) {
    if (e) {
      reply.redirect('/bum');
    } else  {
      var partofOrg = obj.filter(function(i) {
        return i.login === 'printshoppe';
      }).length;

      if (!!partofOrg) {
        // set cookie and redirect to app
        request.auth.session.set({sid: username});
        reply.redirect('/queue');
      } else {
        // tell em to get lost
        reply.redirect('/bum');
      }
    }
  });
};

// /queue view handler
module.exports.queueHandler = function queueHandler(request, reply) {
  dataHelpers.getAllJobs(function(err, data) {
    reply.view('queue', {'message': '~ print shoppe queue is here ~', 'data': data});
  });
};

// /create view handler
module.exports.createHandler = function createHandler(request, reply) {
  console.log(request.payload);
  var payload = request.payload;
  var files = [];

  for (var key in payload) {
    if (payload.hasOwnProperty(key)) {
      var customPat = new RegExp('custom');
      var customUrlPat = new RegExp('custom[0-9]$');
      if ((customPat.test(key)) && (payload[key] !== '') && (payload[key] !== '0')) {
        var idx = parseInt(key.substr(6, 1));
        var idx2, val;
        if (customUrlPat.test(key)) {
          files[idx] = [];
          var keyval = payload[key];
          idx2 = 0;
          var thingPos = keyval.toLowerCase().indexOf('thing:');
          val = keyval.substr(thingPos);
          console.log(val);
        } else {
          idx2 = 1;
          val = keyval;
        }
        console.log(idx, idx2);
        files[idx][idx2] = val;
      }
    }
  }

  var data = {
    'email': payload.email,
    'files': files,
    'message': payload.freetext,
    'status': 'pending'
  };
  
  // data pulls from request object
  dataHelpers.createJob(data, function(err, data) {
     // check this syntax
     io.emit('job:new', data);
     // view is thanks template
    reply.view('thanks', {'message': '~ thanks for using print shoppe ~', 'data': data});
  });

  
  
};