const express = require('express');
var cors = require('cors');

const app = express();

//serves static files directly from server
//app.use(express.static('../../client/public'));

//fixes cors
app.use(cors());
app.use(express.json());
app.use('/api', require('../routes/api'));

//error handling from db
app.use(function(err, req, res, next){
  res.status(422).send({error: err.message});
});

app.listen(process.env.PORT || 8081);