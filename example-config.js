module.exports = {
  userAgent: '', // just for ajax requests
  githubPass: '', // github developer app pass
  githubClientId: '', // github client id
  githubClientSecret: '', //github secret
  authCookiePass: '', // auth cookie pass, just make this one up to be anything
  orgName: '', // orgname for github org memeber check for login
  mailgunOpts: { //mailgun api stuffs, using SMTP approach here
    domain: '',
    pass: '',
    from: '' // from email address each email will come from
  },
  thingiverseOpts: { // for thingiverse api calls to get thumbnail pictures
    client: '',
    secret: '',
    token: ''
  }
};