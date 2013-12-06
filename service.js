var Mailgun = require('mailgun').Mailgun,
    mg = new Mailgun('key-2gsxuklh9jx3-4gqjrycm0swqjofua67');
var st = require('st')({
  path: __dirname + '/public',
  cache: false,
  index : "index.html",
  passthrough: true
});
var qs = require('querystring');
var http = require('http');
var request = require('request');
http.createServer(function(req, res) {
  if (!st(req, res)) {
    var body = "";

    req.on('data', function(chunk) {
      body+=chunk.toString();
    });

    req.on('end', function() {
      if (req.method === 'POST') {
        

        var data = qs.parse(body);
        console.log(data);
        request.post({
          url : 'https://api.mailgun.net/v2/suziam.com/messages',
          auth: {
            user: 'api',
            password: 'key-2gsxuklh9jx3-4gqjrycm0swqjofua67',
          },
          form: data
          
        }, function(err, mailgunResponse) {
          console.log(mailgunResponse.body, mailgunResponse.statusCode);
          if (err) {
            res.writeHead(400);
            res.end((err && err.message) ? err.message : 'unknown error');
            console.log(console.log('Oh noes: ' + err);)
          } else {
            console.log('mail sent on behalf of', data.from);
            res.end('ok');
          }
        });
      }
    });    
  }
}).listen(8080)


