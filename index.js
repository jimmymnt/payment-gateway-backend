'use strict'

const express = require('express');
const app = express();
/// Load env file

require('dotenv').config();

/// Routes
require('./src/configs/routes')(app)

/// Setup Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Application is running at ${PORT}`);
});
