const express = require("express");
const router = express.Router();

const ctrlUser = require("../controllers/user.controller");
const ctrlEvent = require("../controllers/event.controller");
const ctrlProject = require("../controllers/project.controller");
const ctrlVolReg = require("../controllers/volreg.controller");

const ctrlEventList = require("../controllers/pevent.controller");
const ctrlBulkEvent = require("../controllers/bulkevent.controller");



const jwtHelper = require("../config/jwtHelper");


router.post('/addUser', ctrlUser.addUser);
router.post('/addBulkUser', ctrlUser.addBulkUser);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/user/:id', ctrlUser.getUser);
// router.get('/userlist', jwtHelper.verifyJwtToken, ctrlUser.getUsers);
// router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
// router.get('/updateUser:id', jwtHelper.verifyJwtToken, ctrlUser.updateUser);
// router.get('/deleteUser:id', jwtHelper.verifyJwtToken, ctrlUser.deleteUser);

// router.get('/user/:id', jwtHelper.verifyJwtToken, ctrlUser.getUser);

router.get('/userlist', jwtHelper.verifyJwtToken, ctrlUser.getUsers);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/updateUser/:id', ctrlUser.updateUser);
router.delete('/deleteUser/:id', ctrlUser.deleteUser);

router.post('/addEvent', ctrlEvent.addEvent);
router.post('/addEvents', ctrlEvent.addBulkEvents);
router.get('/getEvents', ctrlEvent.getEvents);
router.get('/getEvent/:id', ctrlEvent.getEvent);
router.get('/callFromSer2Ser', ctrlEvent.callFromSer2Ser);




router.post('/updateEvent/:id', ctrlEvent.updateEvent);
router.delete('/deleteEvent/:id', ctrlEvent.deleteEvent);



router.post('/addBulkEvents', ctrlBulkEvent.addBulkEvents);


router.post('/addProject', ctrlProject.addProject);
router.post('/addBulkProjects', ctrlProject.addBulkProjects);
router.post('/findAndIUProject', ctrlProject.findAndIUProject);
router.get('/getProjects', ctrlProject.getProjects);
router.get('/findByProjectName/:id', ctrlProject.getProjects);

router.post('/regUser', ctrlVolReg.Register);
router.post('/unRegUser', ctrlVolReg.UnRegister);
router.post('/bulkEventPostUpdates', ctrlVolReg.BulkEventPostUpdates);

router.get('/procEventDet', ctrlEventList.getEventDetails);
router.get('/getEventDetailsByUser/:uid', ctrlEventList.getEventDetailsByUser);
router.get('/getEventDetailsWithRegUser', ctrlEventList.getEventDetailsWithRegUser);
router.get('/getPendingEventDetails', ctrlEventList.getPendingEventDetails);
router.get('/getEventDetailsById/:eid', ctrlEventList.getEventDetailsById);

router.post('/updateBulkEventStatus/:estatus/:uid', ctrlEvent.updateBulkEventStatus);

module.exports = router;
