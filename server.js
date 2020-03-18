const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serveStatic = require('serve-static');
const firebaseMiddleware = require('express-firebase-middleware');
const history = require('connect-history-api-fallback')

if (process.env.GRAPHENEDB_URL) {
  url = require('url').parse(process.env.GRAPHENEDB_URL);
  var db = require("seraph")({
    server: url.protocol + '//' + url.host,
    user: url.auth.split(':')[0],
    pass: url.auth.split(':')[1]
  });
} else {
  var db = require("seraph")({
    server: "http://localhost:7474",
    user: 'neo4j',
    pass: 'dev'
  });
}
//
// admin.initializeApp({
//   credential: admin.credential.cert({
//     "project_id": "knowlo-952cc",
//     "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//   }),
//   databaseURL: "https://knowlo-952cc.firebaseio.com/"
// });

app.use('/api/auth', firebaseMiddleware.auth)
app.use(bodyParser.json())
app.use(serveStatic(__dirname + "/dist/spa"))
app.use(history())
app.use(serveStatic(__dirname + "/dist/spa"))
// ^ `app.use(serveStatic())` is included twice as per https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware

require('./initDB')(app, db);
require('./CRUD/tags')(app, db);
require('./CRUD/resources')(app, db);
require('./CRUD/members')(app, db);

// task scripts
// require('./dothings')(app, db);

app.listen(process.env.PORT || '8001', function () {
  console.log('listening...')
})
