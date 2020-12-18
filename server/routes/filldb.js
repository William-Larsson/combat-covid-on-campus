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

router.post('/sensor', function(req, res, next){
    console.log('POST sensor to db from body');
    Sensor.create(req.body).then(function(sensor){
      console.log('yay');
      res.send(sensor);
    }).catch(next);
  });


/* LoRa */
/* Get request to Daresay lora at given date*/
router.get('/axios/getDate/:date', function(req, res, next){
  console.log('axios get');

  let date = new Date(req.params.date);
  date.setDate(date.getDate() + 1);
  //console.log('date ' + date.toISOString().split('T')[0]);


  axios.get('https://daresay-dev.eu-gb.cf.appdomain.cloud/innovativa/A81758FFFE03BC34/' 
    + req.params.date + '/'+ date.toISOString().split('T')[0] + '/1/139kTnm10ksR'
  ).then(response => {
    console.log(response.data);
    res.send('axios success');
  }).catch(error => {
    console.log(error);
  });
});

/* Get request to Daresay lora for today */
//TODO: include yesterday??
router.get('/axios/today', function(req, res, next){
  console.log('axios get');

  let dateInt = Date.now();
  let date = new Date(parseInt(dateInt));
  let date2 = new Date();
  date2.setDate(date.getDate() + 1);

  console.log('date today: ' + date + ' ' + date2);
  //let dateT = Date.setDate(date.getDate() + 1);
  //console.log('date ' + date.toISOString().split('T')[0]);

  axios.get('https://daresay-dev.eu-gb.cf.appdomain.cloud/innovativa/A81758FFFE03BC34/' 
    + date.toISOString().split('T')[0] + '/'+ date2.toISOString().split('T')[0] + '/10/139kTnm10ksR'
  ).then(response => {
    console.log(response.data);
    res.send('axios success');
  }).catch(error => {
    console.log(error);
  });
});


module.exports = router;