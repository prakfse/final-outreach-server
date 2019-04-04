var express = require('express');
var router = express.Router();

const jwtHelper = require("../config/jwtHelper");
const ctrlEvent = require("../controllers/event.controller");
const ctrlEventList = require("../controllers/pevent.controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addEvent', jwtHelper.verifyJwtToken, ctrlEvent.addEvent);
router.post('/updateEvent/:id', jwtHelper.verifyJwtToken, ctrlEvent.updateEvent);
router.delete('/deleteEvent/:id', jwtHelper.verifyJwtToken, ctrlEvent.deleteEvent);

router.get('/getEventDetailById/:eid', jwtHelper.verifyJwtToken, ctrlEventList.getEventDetailById);
router.get('/getEventDetails',jwtHelper.verifyJwtToken, ctrlEventList.getEventDetails);
router.get('/getEventDetailsByUser/:uid',jwtHelper.verifyJwtToken, ctrlEventList.getEventDetailsByUser);
module.exports = router;
