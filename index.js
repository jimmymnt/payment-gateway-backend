'use strict'

/// Load env file
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const configs = require('./src/configs');
const oauthRoutes = require('./src/routes/oauth.routes');
const apiRoutes = require('./src/routes/api');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const paymentRoutes = require("./src/routes/payment.routes");
const {webhooksHandler} = require("./src/controllers/payment.controller");
const app = express();

app.post('/stripe-webhooks', express.raw({type: 'application/json'}), webhooksHandler);

/// Cors config
app.use(cors());

/// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

/// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/// Routes
app.use('/oauth', oauthRoutes);
app.use('/api/v1', apiRoutes);
app.use('/api/v1', paymentRoutes);

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

const swaggerOptions = YAML.load('swagger/swagger.yaml')
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerOptions));