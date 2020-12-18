const express = require('express');
const router = express.Router();
const axios = require('axios');

const Sensor = require('../models/sensor');

/* SENSOR */
router.post('/dummysensor', function(req, res, next){
  console.log('POST dummy to db');
  Sensor.create({
    name: 'sensor', 
    LAT: 20.307142,
    LONG: 63.819620,
  }).then(function(sensor){
    console.log('yay');
    res.send(sensor);
  }).catch(next);
});

//TODO add check for existing sensor name
router.post('/sensor', function(req, res, next){
    console.log('POST sensor to db from body');
    Sensor.create(req.body).then(function(sensor){
      console.log('yay');
      res.send(sensor);
    }).catch(next);
  });

//TODO add post for json file with sensor array

module.exports = router;