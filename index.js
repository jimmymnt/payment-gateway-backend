'use strict'

/// Load env file
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const configs = require('./src/configs');
const {authenticate} = require("./src/services/oauth2.service");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/// Routes
const oauthRoutes = require('./src/routes/oauth-flow');
app.use('/oauth', oauthRoutes);
app.get('/', (req, res) => {
  res.send("Hello world");
});
app.get('/users', authenticate, (req, res) => {
  res.json({
    "data": "user data here",
  });
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