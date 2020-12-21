const express = require('express');
const router = express.Router();
const axios = require('axios');

const Sensor = require('../models/sensor');

/* Get test */
router.get('/test', function(req, res, next) {
  console.log('GET req');
    res.send({type: 'get test'});
});


router.get('/sensordata', function(req, res, next) {
  console.log('GET req');
    Sensor.find().then(sensors => {
      console.log('found sensors :D');
      res.send(sensors);
    }).catch(next);
});



module.exports = router;