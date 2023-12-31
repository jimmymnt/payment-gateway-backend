'use strict'

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const configs = require('./src/configs');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
/// Load env file
require('dotenv').config();

/// Routes
const oauthRoutes = require('./src/routes/oauth-flow');
app.use('/oauth', oauthRoutes);

/// Setup Server
const port = process.env.PORT || 3000;
connect();

function listen() {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('App started on port ' + port);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', console.log)
    .once('open', listen);
  return mongoose.connect(configs.db);
}
