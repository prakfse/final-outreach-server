const express = require("express");
const router = express.Router();

const jwtHelper = require("../config/jwtHelper");

const ctrlUser = require("../controllers/user.controller");
const ctrlEvent = require("../controllers/event.controller");
const ctrlProject = require("../controllers/project.controller");
const ctrlVolReg = require("../controllers/volreg.controller");
const ctrlEventList = require("../controllers/pevent.controller");
const ctrlBulkEvent = require("../controllers/bulkevent.controller");
const ctrlEligibilityCheck = require("../controllers/eligibilitycheck.control");
const ctrlEventsReport = require("../controllers/rptevent.controller");

const ctrlEmail = require('../controllers/email.controller');


router.post('/addUser', ctrlUser.addUser);
router.post('/addBulkUser', jwtHelper.verifyJwtToken, ctrlUser.addBulkUser);
router.post('/authenticate', ctrlUser.authenticate);
// router.get('/user/:id', ctrlUser.getUser);
// router.get('/userlist', jwtHelper.verifyJwtToken, ctrlUser.getUsers);
// router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
// router.get('/updateUser:id', jwtHelper.verifyJwtToken, ctrlUser.updateUser);
// router.get('/deleteUser:id', jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.get('/user/:id', jwtHelper.verifyJwtToken, ctrlUser.getUser);
router.get('/userlist', jwtHelper.verifyJwtToken, ctrlUser.getUsers);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/updateUser/:id', jwtHelper.verifyJwtToken,ctrlUser.updateUser);
router.delete('/deleteUser/:id', jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.get('/getBusinessUnits', jwtHelper.verifyJwtToken, ctrlUser.getBusinessUnits);

router.post('/addEvent', jwtHelper.verifyJwtToken, ctrlEvent.addEvent);
router.post('/addEvents', jwtHelper.verifyJwtToken, ctrlEvent.addBulkEvents);
router.post('/asyncAddEvents', jwtHelper.verifyJwtToken, ctrlEvent.asyncAddBulkEvents);
router.get('/getEvents', jwtHelper.verifyJwtToken, ctrlEvent.getEvents);
router.get('/getEvent/:id',  jwtHelper.verifyJwtToken, ctrlEvent.getEvent);
router.get('/asyncTest', ctrlEvent.asyncTest);
router.post('/asyncAddUser',  jwtHelper.verifyJwtToken, ctrlEvent.asyncAddUser);
router.get('/getLocations', jwtHelper.verifyJwtToken, ctrlEvent.getLocations);
router.get('/getCouncils', jwtHelper.verifyJwtToken, ctrlEvent.getCouncils);
router.post('/email', ctrlEmail.toSendEmail);
router.get('/adminlist', ctrlUser.getUsersByRole);

router.post('/updateEvent/:id', jwtHelper.verifyJwtToken, ctrlEvent.updateEvent);
router.delete('/deleteEvent/:id', jwtHelper.verifyJwtToken, ctrlEvent.deleteEvent);
router.post('/updateBulkEventStatus/:estatus/:uid', jwtHelper.verifyJwtToken, ctrlEvent.updateBulkEventStatus);

router.post('/addBulkEvents', jwtHelper.verifyJwtToken, ctrlBulkEvent.addBulkEvents);

router.post('/addProject', jwtHelper.verifyJwtToken, ctrlProject.addProject);
router.post('/addBulkProjects', jwtHelper.verifyJwtToken, ctrlProject.addBulkProjects);
router.post('/findAndIUProject', jwtHelper.verifyJwtToken, ctrlProject.findAndIUProject);
router.get('/getProjects', jwtHelper.verifyJwtToken, ctrlProject.getProjects);
router.get('/findByProjectName/:id', jwtHelper.verifyJwtToken, ctrlProject.getProjects);
router.get('/getProjectNames', jwtHelper.verifyJwtToken, ctrlProject.getProjectNames);

router.post('/regUser', jwtHelper.verifyJwtToken, ctrlVolReg.Register);
router.post('/unRegUser', jwtHelper.verifyJwtToken, ctrlVolReg.UnRegister);
router.post('/bulkEventPostUpdates', jwtHelper.verifyJwtToken, ctrlVolReg.BulkEventPostUpdates);
router.post('/bulkUserRegistration', jwtHelper.verifyJwtToken, ctrlVolReg.bulkUserRegistration);
router.get('/getBusinessUnits', jwtHelper.verifyJwtToken, ctrlVolReg.getBusinessUnits);

router.get('/getEventDetails', jwtHelper.verifyJwtToken, ctrlEventList.getEventDetails);
router.get('/getEventDetailsByUser/:uid',jwtHelper.verifyJwtToken, ctrlEventList.getEventDetailsByUser);
router.get('/getEventDetailsForRegUsers', jwtHelper.verifyJwtToken, ctrlEventList.getEventDetailsForRegUsers);
router.get('/getPendingEventDetails', jwtHelper.verifyJwtToken, ctrlEventList.getPendingEventDetails);
router.get('/getPendingEvents', jwtHelper.verifyJwtToken, ctrlEventList.getPendingEvents);
router.get('/getEventDetailById/:eid', jwtHelper.verifyJwtToken, ctrlEventList.getEventDetailById);

router.get('/ctrlEligibilityCheck', jwtHelper.verifyJwtToken, ctrlEligibilityCheck.checkAvailability);

router.get('/getEventSummary', jwtHelper.verifyJwtToken, ctrlEventsReport.getEventSummary);

module.exports = router;
