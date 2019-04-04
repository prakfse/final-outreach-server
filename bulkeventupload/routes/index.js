var express = require('express');
var router = express.Router();

const jwtHelper = require("../config/jwtHelper");
const ctrlEvent = require("../controllers/event.controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/asyncAddEvents', jwtHelper.verifyJwtToken, ctrlEvent.asyncAddBulkEvents);
module.exports = router;
