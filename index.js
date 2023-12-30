'use strict'
const mongoose = require('mongoose');
const express = require('express');
const configs= require('./src/configs');
const app = express();

/// Load env file
require('dotenv').config();

/// Routes
require('./src/configs/routes')(app)

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
