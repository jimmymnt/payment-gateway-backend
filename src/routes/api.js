const express = require('express')
const router = express.Router()

module.exports = function(app) {
  app.get('/', (req, res) => {
    res.send("hello");
  });

  router.get('/jwt/verify', (req, res) => {
    res.send('verifing your JWT');
  });

  app.use('/api/v1', router);
}
