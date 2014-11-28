var Path = require('path');
var Hapi = require('hapi');
var https = require('https');
var config = require('./config');
var dataHelpers = require('./dataHelpers');
var notifications = require('./notifications');
var app = require('./app');

var serverOptions = {
  views: {
      engines: {
        html: {
          module: require('handlebars')
        }
      },
      path: Path.join(__dirname, '/public/templates/'),
      partialsPath: __dirname + '/public/templates/'
  }
};

// Create a server with a host and port
var server = new Hapi.Server(8000, serverOptions);
var io = require('socket.io')(server.listener)
  .on('connection', function (socket) {
      socket.emit('server ready');
  });
// hit github api and get organisation of authenticated user
function getOrg(username, fn) {

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
}

server.pack.register([require('bell'), require('hapi-auth-cookie')], function (err) {

  // bell registration with github auth
  server.auth.strategy('github', 'bell', {
      provider: 'github',
      password: config.githubPass,
      clientId: config.githubClientId,
      clientSecret: config.githubClientSecret,
      scope: ['read:org'],
      isSecure: false     // Terrible idea but required if not using HTTPS
  });

  // hapi-auth-cookie registration
  server.auth.strategy('session', 'cookie', {
      password: config.authCookiePass,
      cookie: 'sid-printshoppe',
      redirectTo: '/login',
      isSecure: false
  });

  // route public js
  server.route({
    method: 'GET',
    path: '/scripts/{param*}',
    handler: {
        directory: {
            path: 'public/scripts'
        }
    }
  });

  // Add the routes
  server.route({
    method: ['GET', 'POST'], 
    path: '/login',          // callback endpoint registered with github
    config: {
      auth: 'github',
      handler: function (request, reply) {
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
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/queue',
    config: {       
      auth: 'session',
      handler: function (request, reply) {
        reply.view('queue', {message: '~ print shoppe queue is here ~'});
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {       
      handler: function (request, reply) {
        reply.view('index', {message: '~ welcome to print shoppe ~'});
      }
    }
  });

  // Add the route
  server.route({
    method: 'GET',
    path: '/logout',
    config: {       
      auth: 'session',
      handler: function (request, reply) {
        request.auth.session.clear();
        reply('you are now logged out.');
      }
    }    
  });

  // Start the server
  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });

});