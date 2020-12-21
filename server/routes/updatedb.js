const express = require('express');
const router = express.Router();
const axios = require('axios');

const Sensor = require('../models/sensor');

/* LoRa */

//returns a sensor
router.get('/sensor/sensorid/:sensorid', function(req, res, next){
  console.log('finding a sensor');
  Sensor.findOne({name: req.params.sensorid}).then(function(sensor){
    console.log('found ' + sensor.name);
    res.send(sensor);
  }).catch(next);
});

//updates a sensor
router.put('/sensor/sensorid/:sensorid', function(req, res, next){
  console.log('update a sensor');
  Sensor.updateOne({name: req.params.sensorid}, req.body).then(function(){
    Sensor.findOne({name: req.params.sensorid}).then(function(sensor){
      console.log('updated ' + sensor.name);
      res.send(sensor);
    });
  }).catch(next);
});

//updates by only using the latest value of all sensors
router.get('/sensor/all/now', function(req, res, next){
  //fetch list on sensor names from db
  console.log('updating all sensors');
  Sensor.find().then(function(sensors){
    //res.send(sensors);
    //loop through all names and fetch LoRa data for each
    let i = 0;
    sensors.forEach( sensor => {
      let dateInt = Date.now();
      let dateToday = new Date(parseInt(dateInt));
      let dateTomorrow = new Date();
      dateTomorrow.setDate(dateToday.getDate() + 1);

      //axios req
      axios.get('https://daresay-dev.eu-gb.cf.appdomain.cloud/innovativa/' + sensor.name + '/' 
        + dateToday.toISOString().split('T')[0] + '/'+ dateTomorrow.toISOString().split('T')[0] + '/1/139kTnm10ksR'
      ).then(response => {
        i++;
        //check if there is a response
        if(response.data.length > 0) {
          //calculate heat value
          /*
          *response.pir ===  --> heat = 0
          *response.pir >= 8 --> heat = 5
          */
           let heatValue = Math.floor(response.data[0].dd.pir /1.6); //1.6 = Each person's risk value 8/5
           console.log('loop nr ' + i + ' and sensor ' + sensor.name);
           console.log('pir value ' + response.data[0].dd.pir + ' and heatV ' + heatValue);

           //console.log('res: ' + response.data[0]);

           //adjusts so that max heat is 5
          if(heatValue > 5) {
            heatValue = 5;
          }
          //add heat and time to db
          Sensor.updateOne({name: sensor.name}, {
            heatValue: heatValue,
            timestamp: response.data[0].time
          }).then(function(){
            console.log('updated sensor ' +  sensor.name);
          }).catch(next => {
            console.log('failed to update sensor ' +  sensor.name);
          });
           
        }
        

        //res.send('axios success');
      }).catch((error) => {
        console.log(error) //Logs a string: Error: Request failed with status code 404
      });
    });

    res.send({type: 'success'});
  }).catch(next);
});


/*TODO node BB9B does not update properly, but BB36 updates twice*/

//updates heat for last 10 hours of all sensors
//TODO does not adjust for day change
router.get('/sensor/all', function(req, res, next){
  //fetch list on sensor names from db
  console.log('updating all sensors');
  Sensor.find().then(function(sensors){
    //res.send(sensors);
    //loop through all names and fetch LoRa data for each
    let i = 0;
    sensors.forEach( sensor => {
      let dateInt = Date.now();
      let dateToday = new Date(parseInt(dateInt));
      let dateTomorrow = new Date();
      dateTomorrow.setDate(dateToday.getDate() + 1);

      //axios req
      axios.get('https://daresay-dev.eu-gb.cf.appdomain.cloud/innovativa/' + sensor.name + '/' 
        + dateToday.toISOString().split('T')[0] + '/'+ dateTomorrow.toISOString().split('T')[0] + '/10/139kTnm10ksR'
      ).then(response => {
        i++;
        //check if there is a response
        if(response.data.length > 0) {
          //calculate heat value
          let heatValue = 0;

          for (let j = 0; j < response.data.length; j++) {
            /*
             *response.pir ===  --> heat = 0
             *response.pir >= 8 --> heat = 5
             */
              heat = Math.floor(response.data[j].dd.pir /1.6); //1.6 = Each person's risk value 8/5

            //add reduction over time
            /*
             *<1h ago --> time modifier x1
             *>8h ago --> time modifier x0
             */

              let time = new Date(response.data[j].time);
              let now = new Date(parseInt(Date.now()));
              //hour now - hour sample
              //console.log('now: ' + now.getHours() + ' and time: ' + time.getHours());
              let timedifference = now.getHours() - time.getHours();
              //console.log('now: ' + now.getHours() + ' and time: ' + time.getHours() + ' modifier: ' + timedifference);
              let timemodifier = 0;
              if (timedifference < 8 && timedifference > 0) {
                //TODO work on this formula to make it better
                timemodifier = 1/(timedifference);
              } else if (timedifference === 0) {
                timemodifier = 1;
              }
             console.log('heat ' + heat + 'timemod ' + timemodifier);
             heat = Math.ceil(heat*timemodifier);
             //console.log(' Pir: ' + response.data[j].dd.pir + ' timemodifier: ' + timemodifier);
             console.log('heat value: ' + heat);
             if(heat > 5) {
                heat = 5;
              }

             //sets largest heat impact
             console.log('heat ' + heat + 'heatV ' + heatValue);
              heatValue = Math.max(heatValue, heat);
              //console.log('pir value ' + response.data[j].dd.pir + ' and heatV ' + heat);

          }
          //console.log('loop nr ' + i + ' and sensor ' + sensor.name);
           //console.log('res: ' + response.data[0]);

           //adjusts so that max heat is 5
          
          //add heat and time to db
          
          Sensor.updateOne({name: sensor.name}, {
            heatValue: heatValue,
            timestamp: response.data[0].time
          }).then(function(){
            console.log('updated sensor ' +  sensor.name + ' with heat: ' + heatValue);
          }).catch(next => {
            console.log('failed to update sensor ' +  sensor.name);
          });        
        }
        
        //res.send('axios success');
      }).catch((error) => {
        console.log(error) //Logs a string: Error: Request failed with status code 404
      });
    });

    res.send({type: 'success'});
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
    + date.toISOString().split('T')[0] + '/'+ date2.toISOString().split('T')[0] + '/10/139kTnm10ksR'
  ).then(response => {
    console.log(response.data);
    res.send('axios success');
  }).catch(error => {
    console.log(error);
  });
});


module.exports = router;