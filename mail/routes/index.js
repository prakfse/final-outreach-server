var express = require('express');
var router = express.Router();

const ctrlEmail = require('../controllers/email.controller');
const ctrlAdmin = require("../controllers/admin.controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/email/', ctrlEmail.toSendEmail);
router.get('/adminlist', ctrlAdmin.getUsersByRole);

module.exports = router;
