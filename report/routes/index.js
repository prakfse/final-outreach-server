var express = require('express');
var router = express.Router();

const jwtHelper = require("../config/jwtHelper");
const ctrlEventsReport = require("../controller/rptevent.controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getEventSummary', jwtHelper.verifyJwtToken, ctrlEventsReport.getEventSummary);
module.exports = router;
