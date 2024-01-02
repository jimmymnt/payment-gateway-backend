'use strict'

/// Load env file
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const configs = require('./src/configs');
const {authenticate} = require("./src/services/oauth2.service");
const oauthRoutes = require('./src/routes/oauth-flow');
const apiRoutes = require('./src/routes/api');
const {createUser} = require("./src/models/user");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

/// Routes
app.use('/oauth', oauthRoutes);
app.use('/api/v1', apiRoutes);
app.get('/', (req, res) => {
  res.send("Hello world");
});

/// Setup Server
const port = process.env.PORT || 3000;
connect().then();

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