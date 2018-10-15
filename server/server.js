require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');

// Establish the mongoose database connection.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {
    mongoose
};

// App configuration
var app = express();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

// Static folder to all the uploaded files
app.use('/image', express.static(__dirname + '/uploads'));

// Parse to JSON
app.use(bodyParser.json());

// Configure CORS (Cross-Origin Resource Sharing)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Expose-Headers', process.env.AUTH_HEADER);
  res.header('Access-Control-Allow-Headers', `Accept, Authorization, Content-Type, X-Requested-With, Range, ${process.env.AUTH_HEADER}`);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

routes(app);

// IY - This is temporary API used to test Mocha Integration
app.get('/api', (req, res) => {
  res.send({ hi: 'there' });
});

module.exports = app;

// cd ~/mongo/bin
// ./mongod --dbpath ~/mongo-data/

// heroku create
// heroku addons:create mongolab:sandbox
// heroku config
// heroku logs
// heroku config:set NAME=VALUE
// heroku config:get NAME
// heroku config:unset NAME
// git push heroku

// Start Server in Dev: npm run
// Start Server in Test: npm test

// Supertest: A tool that helps us make fake HTTP requests to
 // our application