const express = require('express');
const router = express.Router();
const axios = require('axios');

const Test = require('../models/test');
const Sensor = require('../models/sensor');

/* Get test */
router.get('/test', function(req, res, next) {
  console.log('GET req');
    res.send({type: 'get test'});
});




module.exports = router;