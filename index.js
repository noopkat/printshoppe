var Path = require('path');
var Hapi = require('hapi');
var https = require('https');
var config = require('./config');
var dataHelpers = require('./dataHelpers');
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
// create socket
var io = require('socket.io')(server.listener);
// create initial socket subscriptions
app.setupSocket(io);

// register hapi plugins for auth
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

  // route public images
  server.route({
    method: 'GET',
    path: '/images/{param*}',
    handler: {
        directory: {
            path: 'public/images'
        }
    }
  });

  // route public css
  server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: 'public/css'
        }
    }
  });

  // route public fonts
  server.route({
    method: 'GET',
    path: '/fonts/{param*}',
    handler: {
        directory: {
            path: 'public/fonts'
        }
    }
  });

  // Add the routes
  server.route({
    method: ['GET', 'POST'], 
    path: '/login',          // callback endpoint registered with github
    config: {
      auth: 'github',
      handler: app.loginHandler
    }
  });

  server.route({
    method: 'GET',
    path: '/queue',
    config: {       
      auth: 'session',
      handler: app.queueHandler
    }
  });

  server.route({
    method: 'POST',
    path: '/create',
    config: {       
      handler: app.createHandler
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