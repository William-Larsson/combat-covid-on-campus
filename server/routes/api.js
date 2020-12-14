const express = require('express');
const router = express.Router();

/* Gets all sites */
router.get('/test', function(req, res, next) {
  console.log('GET req');
    res.send({type: 'get test'});
});

module.exports = router;