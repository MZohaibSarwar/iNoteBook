const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Zohaib Notes!')
  }) 

  module.exports = router 