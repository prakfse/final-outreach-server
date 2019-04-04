const mongoose = require('mongoose');
const passport = require('passport');
const request = require("request");
//const config = require('../config/config');

const _ = require('lodash');
const User = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;
let mailUsers = [];

var ObjectId = mongoose.Types.ObjectId;

module.exports.addUser = (req, res, next) => {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.displayName = req.body.displayName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.empId = req.body.empId;
    user.buName = req.body.buName;
    user.createdDt = Date.now();
    user.updatedDt = Date.now();
    user.role = "Normal";
    user.userStatus = "Active";
    user.save((err, doc) => {
        if (!err) {
            res.send(doc);
            //mailer.prepAndSendEmail('signup',mailUsers);
           // mailCtrl.toSendEmail('signup', user);
            console.log("**********ADDD USER ***********");
            mailforUsers('signup', user);

        }
        else {
            if (err.code === 11000) {
                console.log(err);
                res.status(422).send(["Duplicate email/ emp id found."]);
            }
            else
                return next(err);
        }
    });
}


module.exports.addBulkUser = (req, res, next) => {
    var users = [] = req.body;

    users.forEach(e => {
        console.log('User : ' + e.firstName);
        User.findOne({ $or: [{ empId: e.empId, email: e.email }] })
            .then(u => {
                if (!u) {
                    var user = new User();
                    user.empId = e.empId;
                    user.firstName = e.firstName;
                    user.lastName = e.lastName;
                    user.displayName = e.firstName + ", " + e.lastName;
                    user.password = "123456";
                    user.email = e.email;
                    user.userStatus = 'Active';
                    user.save((err, doc) => {
                        if (!err) {
                            res.send(doc);
                            //mailer.prepAndSendEmail('signup',mailUsers);  
                        }
                        else {
                            console.log("ERROR: Testing: " + JSON.stringify(err));
                        }
                    });
                }
            })

    });
    User.find(function (err, userData) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(userData);
    });


}

module.exports.findAndIUUser = async (req, res, next) => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var data = req;

            console.log('User : ' + JSON.stringify(data));
            User.findOne({ $or: [{ empId: data.empId, email: data.email }] })
                .then(u => {
                    if (!u) {
                        var user = new User();
                        user.empId = data.empId;
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.displayName = data.firstName + ", " + data.lastName;
                        user.password = data.password;
                        user.email = data.email;
                        user.userStatus = 'Active';
                        user.role = 'Normal';
                        user.buName = data.buName;
                        user.createdDt = Date.now();
                        user.updatedDt = Date.now();

                        console.log('New User: ' + JSON.stringify(user));
                        user.save((err, doc) => {
                            if (!err) {
                                console.log('User account: ' + data.firstName + ' has been created successfully !!! ');
                                resolve(doc);
                                //mailer.prepAndSendEmail('signup',mailUsers);  
                            }
                            else {
                                console.log(err);
                                resolve(null)
                            }
                        })
                    }
                    else {
                        console.log('Existing User');
                        resolve(u);
                    }
                })
        }, 500);
    });
}


// module.exports.addBulkUser = (req, res, next) => {
//     var bulkUsers = User.collection.initializeUnorderedBulkOp();
//     var users = [] = req.body;

//     users.forEach(e => {
//         console.log('User : ' + e.firstName);
//         var user = new User();
//         user.firstName = e.firstName;
//         user.lastName = e.lastName;
//         user.email = e.email;
//         user.empId = e.empId;
//         user.displayName = e.displayName;
//         user.password = e.password;
//         user.userStatus = 'Active';

//         bulkUsers.insert(user);

//     });

//     bulkUsers.execute(function (err, uDoc) {
//         if(err) {
//             console.log('Error while executing the bulk user upload.');   
//             console.log(err); 
//             res.status(422).send(["Error while executing the bulk user upload."]);      
//         }
//         else{
//             console.log('Sucessfully executed the Bulk user update operations.');
//             res.send(uDoc);
//         }
//     });
// }

module.exports.authenticate = (req, res, next) => {
    console.log('Request: ')
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport autheticate
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.getUsers = (req, res) => {
    User.find(function (err, userData) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(userData);
    }).sort({ updatedDt: -1 });
}

module.exports.getUser = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No user record found with given id: ' + req.params.id);
    else {
        User.findById(req.params.id, function (err, userData) {
            if (err)
                console.log('Error in Retriving User: ' + JSON.stringify(err, undefined, 2));
            else
                res.send(userData);
        });
    }
}

module.exports.getUserByEmpId = (pEmpId) => {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            User.findOne({ empId: pEmpId })
                .then(user => {
                    if (user)
                        resolve(user)
                    else
                        resolve(null);
                }, 500);
        })
    )
}

// read admin users from users table    
module.exports.getUsersByRole = async () => {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            console.log('inside asdfbasdfsdf');
            User.find({ 'role': { '$in': ["Admin", 'PMO'] } }, function (err, userData) {
                //console.log('inside getUsersByRole11');             
                if (err) {
                    console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
                    resolve(null);
                }
                else {
                    // console.log(' Hi : ' + JSON.stringify(userData)) ;
                    //  console.log("Hhhhhhhhh---"+userData);
                    resolve(userData);
                }
            });
        }, 1000))
}




module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, messgae: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['_id', 'displayName', 'email', 'empId', 'role']) });
        }
    )
}

module.exports.getBusinessUnits = (req, res) => {
    User.distinct('buName', function (err, buNames) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(buNames);
    });

}

module.exports.deleteUser = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No user record found with given id: ' + req.params.id);
    else {
        var user = {
            userStatus: 'Disabled'
        }
        User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
            if (!err)
                res.send(doc);
            else
                console.log('Error in updating the User: ' + req.params.id + " - " + JSON.stringify(err, undefined, 2));
        });
    }
}

module.exports.updateUser = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No user record found with given id: ' + req.params.id);
    else
        var user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            displayName: req.body.displayName,
            email: req.body.email,
            buName: req.body.buName,
            role: req.body.role,
            updatedDt: Date.now(),
            userStatus: req.body.userStatus
        };

    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
        if (!err)
            res.send(doc);
        else
            console.log('Error in updating the User: ' + req.params.id + " - " + JSON.stringify(err, undefined, 2));
    });
}

module.exports.getMessage = (req) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Hi ' + req);
        }, 500)
    })
}

 module.exports.asyncAddUser = (req, res, next) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            User.findOne({ $or: [{ empId: req.empId, email: req.email }] })
                .then(u => {
                    if (!u) {
                        console.log('New User');
                        var user = new User();
                        user.firstName = req.firstName;
                        user.lastName = req.lastName;
                        user.displayName = req.displayName;
                        user.email = req.email;
                        user.password = req.password;
                        user.empId = req.empId;
                        user.role = "Normal";
                        user.userStatus = "Active";
                        mailUsers = [
                            {
                                name: 'Admin',
                                email: 'prakashrajumca@gmail.com'
                            },
                            {
                                name: 'PMO',
                                email: "jtechsiva@gmail.com"
                            },
                            {
                                name: user.firstName,
                                email: user.email
                            }]

                        user.save((err, doc) => {
                            if (!err) {
                                resolve(doc);
                                // mailer.prepAndSendEmail('signup',mailUsers);  
                            }
                            else {
                                console.log(err);
                                resolve(null);
                            }
                        });
                    }
                    else {
                        console.log('Existing User');
                        resolve(u);
                    }
                })
        }, 500);
    })
}

function mailforUsers(activity, event) {
    console.log('mailforEvent: ' + activity);
    var url = process.env.MAIL_URI;
    console.log('url : '+url);
    var data = {
        "activity": activity,
        "mailCont": event
    };
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            request.post({
                url: url,
                body: data,
                json: true
            }, function (error, response, body) {
                if (!error) console.log(body);
                else console.log(error);
            });
        }, 1000)
    );
}