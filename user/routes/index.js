var express = require('express');
var router = express.Router();

 const jwtHelper = require("../config/jwtHelper");
 const ctrlUser = require("../controllers/user.controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/addUser', ctrlUser.addUser);
router.post('/addBulkUser', jwtHelper.verifyJwtToken, ctrlUser.addBulkUser);
// router.post('/authenticate', ctrlUser.authenticate);
router.get('/user/:id', jwtHelper.verifyJwtToken, ctrlUser.getUser);
router.get('/userlist',  jwtHelper.verifyJwtToken,ctrlUser.getUsers);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/updateUser/:id', jwtHelper.verifyJwtToken,ctrlUser.updateUser);
router.delete('/deleteUser/:id', jwtHelper.verifyJwtToken, ctrlUser.deleteUser);


module.exports = router;
