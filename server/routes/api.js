const express = require('express');
const router = express.Router();
const axios = require('axios');

const Test = require('../models/test');

/* Get test */
router.get('/test', function(req, res, next) {
  console.log('GET req');
    res.send({type: 'get test'});
});

/* Post to db test*/
router.post('/dbpost', function(req, res, next){
  console.log('POST to db');
  Test.create({name: 'test', value: 2}).then(function(test){
    console.log('yay');
    res.send(test);
  }).catch(next);
});

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
    + date.toISOString().split('T')[0] + '/'+ date2.toISOString().split('T')[0] + '/1/139kTnm10ksR'
  ).then(response => {
    console.log(response.data);
    res.send('axios success');
  }).catch(error => {
    console.log(error);
  });
});


module.exports = router;