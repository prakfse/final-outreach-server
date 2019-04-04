const mongoose = require('mongoose');
const Volreg = mongoose.model('Volreg');
var mailer = require("../config/mailer.js");
const userCtrl = require("./user.controller");
const echeckCtrl = require("./eligibilitycheck.control");
const mailCtrl = require("../controllers/email.controller");
const ctrlChkAndUpdtRegStatus = require("../controllers/updateregstatus.controller");

const Event = mongoose.model('Event');



module.exports.Register = async (req, res, next) => {
    var data = req.body;
    console.log(JSON.stringify(data));
    var user = await userCtrl.getUserByEmpId(data.regTo);
    var seatStatus = await echeckCtrl.checkAvailability(data.eventId);
    Volreg.findOne({ regTo: user, eventId: data.eventId })
        .then(volreg => {
            if (!volreg) {
                var volreg = new Volreg();
                volreg.regTo = user;
                volreg.eventId = new mongoose.Types.ObjectId(data.eventId);
                volreg.regDt = Date.now();
                volreg.sourceType = data.sourceType;
                volreg.transMod = data.transMod;
                volreg.boardingPtDet = data.boardingPtDet;
                volreg.droppingPtDet = data.droppingPtDet;
                volreg.seatNo = seatStatus.seatNo;
                volreg.regStatus = seatStatus.status;
                volreg.travelHr = data.travelHr;
                volreg.actualVolHr = data.actualVolHr;
                volreg.participationStatus = data.participationStatus;
                volreg.isRegUser = data.isRegUser;
                volreg.createdBy = data.regTo;
                volreg.createdDt = Date.now();
                volreg.updatedBy = data.regTo;
                volreg.updatedDt = Date.now();
                console.log("Before Update in volreg: ");
                volreg.save((err, doc) => {
                    if (!err) {
                        console.log("Volunteering Registration has been completed");

                        console.log("Event ID: " + data.eventId + " | Vol Reg ID: " + doc._id);
                        Event.findByIdAndUpdate({ _id: data.eventId },
                            { $push: { regUsers: doc._id } }, { new: true, upsert: true },
                            (err, doc) => {
                                if (!err) {
                                    res.send(doc); //console.log(' Updated the event category: ' + ieventCat + " successfully") //res.send(doc);        
                                    console.log('***********volunteer*************');
                                    mailCtrl.toSendEmail('volunteer', volreg);

                                }
                                else
                                    res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                            });
                        //res.send(doc);        
                    }
                    else {
                        if (err.code === 11000)
                            res.status(422).send(["You are already register."]);
                        else
                            return next(err);
                    }
                });
            }
            else {
                var vReg = {
                    regStatus: 'Confirmed',
                    updatedBy: data.regTo,
                    updatedDt: Date.now()
                };
                console.log("Re-register: " + JSON.stringify(vReg));
                Volreg.findByIdAndUpdate(volreg._id, { $set: vReg }, { new: true },
                    (err, doc) => {
                        if (!err)
                            res.send(doc);
                        else
                            console.log('Error in updating the User: ' + req.params.id + " - " + JSON.stringify(err, undefined, 2));
                    });
                console.log('User is already register to the event');
                //return res.status(200).json({ status: true, message: 'User is already register to the event'});
            }
        })
}

module.exports.UnRegister = async (req, res, next) => {
    var data = req.body;
    var retRec;
    var isSuccess = false;
    console.log('UnRegister: ' + JSON.stringify(data));
    const user = await userCtrl.getUserByEmpId(data.regTo);
    Volreg.findOne({ regTo: user, eventId: data.eventId })
        .then(volreg => {
            if (volreg) {
                var vReg = {
                    regStatus: 'UnRegistered',
                    updatedBy: data.regTo,
                    updatedDt: Date.now()
                };
                Volreg.findByIdAndUpdate(volreg._id, { $set: vReg },
                    { new: true }, (err, doc) => {
                        if (!err) {
                            console.log('Event is present');
                            console.log('First Updated rec: ' + doc);
                            Volreg.updateMany({
                                $and: [{
                                    eventId: data.eventId,
                                    regStatus: 'WL'
                                }]
                            }, { $inc: { seatNo: -1 } },
                                { new: true, multi: true }, (err, docs) => {
                                    if (!err) {
                                        console.log('Decrease the seat No');
                                        console.log(JSON.stringify(docs));
                                        Volreg.updateOne({
                                            $and: [{
                                                eventId: new mongoose.Types.ObjectId(data.eventId),
                                                regStatus: 'WL', seatNo: 0
                                            }]
                                        },
                                            { $set: { regStatus: 'Confirmed' } },
                                            { new: true }, (err, doc) => {
                                                if (!err) {
                                                    console.log(JSON.stringify(doc));
                                                    res.send(doc);
                                                }
                                                else {
                                                    console.log('Not updated the confirmed status');
                                                    res.send('Not updated the confirmed status');
                                                }
                                            }
                                        )
                                    }
                                    else {
                                        console.log('Not decrease the seat no.');
                                        res.send(err);
                                    }
                                })
                        }
                    })

            }
            else {
                console.log('Given record is already in Unregistered status: ' + volreg._id);
                res.send(volreg);
            }
        });
    //console.log (JSON.stringify(volreg));
}

// module.exports.BulkEventPostUpdates = (req, res, next) => {
//    var data = req.body;   
//    console.log(JSON.stringify(data));
//    data.forEach(e => {   
//       console.log(e.regTo + " -- " + e.eventId);

//       Volreg.findOne({regTo: e.regTo, eventId : e.eventId})
//       .then(volreg => {
//          if(!volreg) {
//             var vreg = new Volreg();
//             vreg.regTo = e.regTo;
//             vreg.eventId = e.eventId;
//             vreg.regDt = Date.now();
//             vreg.regStatus = e.regStatus;
//             vreg.sourceType = e.sourceType;
//             vreg.travelHr = e.travelHr;
//             vreg.actualVolHr = e.actualVolHr;
//             vreg.participationStatus  = e.participationStatus;
//             vreg.isRegUser  = true;
//             vreg.createdBy = e.regTo;
//             vreg.createdDt = Date.now();
//             vreg.updatedBy = e.regTo;
//             vreg.updatedDt = Date.now();
//             console.log("Before Update in new user: ");
//             vreg.save((err, doc) => {
//                  if(!err)
//                  {
//                     console.log("Volunteering Registration has been completed");

//                     console.log("Event ID: " + e.eventId + " | Vol Reg ID: " + doc._id) ;
//                     Event.findByIdAndUpdate({_id: e.eventId }, 
//                      {$push: {regUsers: doc._id}}, {new: true, upsert: true},
//                       (err, doc) => {
//                      if(!err)
//                           res.send(doc); //console.log(' Updated the event category: ' + ieventCat + " successfully") //res.send(doc);        
//                      else 
//                         res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
//                      });
//                     //res.send(doc);        
//                  }
//                  else{
//                         return next(err);          
//                  }
//             });
//           }   
//          else
//           {
//              console.log('Existing USer: ' + JSON.stringify());
//             var vreg = {
//                travelHr : e.travelHr,
//                actualVolHr: e.actualVolHr,
//                participationStatus: e.participationStatus,
//                isRegUser: (e.isRegUser == "New"),
//                updatedBy: e.regTo,
//                updatedDt:  Date.now()
//             }
//             console.log("Before Update in volreg: " + JSON.stringify(vreg));
//             Volreg.findByIdAndUpdate(volreg._id, {$set: vreg}, 
//                {new: true}, (err, doc) => {
//                if(!err)
//                    console.log("Sucessfully updated the post event details for user : " + e.regTo ) ///res.send(doc);        
//                else 
//                   console.log('Error in updating the User: ' + e.regTo + " - " + JSON.stringify(err, undefined, 2) );
//             });
//           }
//       })
//    });

//    Volreg.find(function (err, volregs) {               
//       if (err) 
//           console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
//       else 
//           res.send(volregs);
//   });

// }


module.exports.BulkEventPostUpdates1 = async (req, res, next) => {
    var data = req.body;
    console.log(JSON.stringify(data));
    data.forEach(e => {
        console.log(e.regTo + " -- " + e.eventId);

        Volreg.findOne({ regTo: e.regTo, eventId: e.eventId })
            .then(volreg => {
                if (!volreg) {
                    var vreg = new Volreg();
                    vreg.regTo = e.regTo;
                    vreg.eventId = e.eventId;
                    vreg.regDt = Date.now();
                    vreg.regStatus = e.regStatus;
                    vreg.sourceType = e.sourceType;
                    vreg.travelHr = e.travelHr;
                    vreg.actualVolHr = e.actualVolHr;
                    vreg.participationStatus = e.participationStatus;
                    vreg.isRegUser = true;
                    vreg.createdBy = e.regTo;
                    vreg.createdDt = Date.now();
                    vreg.updatedBy = e.regTo;
                    vreg.updatedDt = Date.now();
                    console.log("Before Update in new user: ");
                    vreg.save((err, doc) => {
                        if (!err) {
                            console.log("Volunteering Registration has been completed");

                            console.log("Event ID: " + e.eventId + " | Vol Reg ID: " + doc._id);
                            Event.findByIdAndUpdate({ _id: e.eventId },
                                { $push: { regUsers: doc._id } }, { new: true, upsert: true },
                                (err, doc) => {
                                    if (!err)
                                        res.send(doc); //console.log(' Updated the event category: ' + ieventCat + " successfully") //res.send(doc);        
                                    else
                                        res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                                });
                            //res.send(doc);        
                        }
                        else {
                            return next(err);
                        }
                    });
                }
                else {
                    console.log('Existing USer: ' + JSON.stringify());
                    var vreg = {
                        travelHr: e.travelHr,
                        actualVolHr: e.actualVolHr,
                        participationStatus: e.participationStatus,
                        isRegUser: (e.isRegUser == "New"),
                        updatedBy: e.regTo,
                        updatedDt: Date.now()
                    }
                    console.log("Before Update in volreg: " + JSON.stringify(vreg));
                    Volreg.findByIdAndUpdate(volreg._id, { $set: vreg },
                        { new: true }, (err, doc) => {
                            if (!err)
                                console.log("Sucessfully updated the post event details for user : " + e.regTo) ///res.send(doc);        
                            else
                                console.log('Error in updating the User: ' + e.regTo + " - " + JSON.stringify(err, undefined, 2));
                        });
                }
            })
    });

    Volreg.find(function (err, volregs) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(volregs);
    });

}
module.exports.BulkEventPostUpdates = async (req, res, next) => {
    var data = [] = req.body;
    console.log(JSON.stringify(data));
    for (const e of data) {
        console.log(e.regTo + " -- " + e.eventId);

        var uDet = {
            empId: e.regTo,
            firstName: e.name,
            lastName: e.name,
            displayName: e.name + ", " + e.name,
            buName: e.buName,
            password: "123456",
            role: "Normal",
            email: e.email,
            userStatus: 'Active'
        }

        var user = await userCtrl.findAndIUUser(uDet);

        Volreg.findOne({ regTo: user, eventId: e.eventId })
            .then(volreg => {
                if (!volreg) {
                    var vreg = new Volreg();
                    vreg.regTo = user;
                    vreg.eventId = e.eventId;
                    vreg.regDt = Date.now();
                    vreg.regStatus = e.regStatus;
                    vreg.sourceType = e.sourceType;
                    vreg.travelHr = e.travelHr;
                    vreg.actualVolHr = e.actualVolHr;
                    vreg.participationStatus = e.participationStatus;
                    vreg.isRegUser = true;
                    vreg.createdBy = e.regTo;
                    vreg.createdDt = Date.now();
                    vreg.updatedBy = e.regTo;
                    vreg.updatedDt = Date.now();
                    console.log("Before Update in new user: ");
                    vreg.save((err, doc) => {
                        if (!err) {
                            console.log("Volunteering Registration has been completed");

                            console.log("Event ID: " + e.eventId + " | Vol Reg ID: " + doc._id);
                            Event.findByIdAndUpdate({ _id: e.eventId },
                                { $push: { regUsers: doc._id }, eventStatus: 'Closed' }, { new: true, upsert: true },
                                (err, doc) => {
                                    if (!err)
                                        console.log(' Updated the participants in the event successfully'); //res.send(doc);        
                                    else
                                        res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                                });
                            //res.send(doc);        
                        }
                        else {
                            return next(err);
                        }
                    });
                }
                else {
                    console.log('Existing USer: ' + JSON.stringify());
                    var vreg = {
                        travelHr: e.travelHr,
                        actualVolHr: e.actualVolHr,
                        participationStatus: e.participationStatus,
                        isRegUser: (e.isRegUser == "New"),
                        updatedBy: e.regTo,
                        updatedDt: Date.now()
                    }
                    console.log("Before Update in volreg: " + JSON.stringify(vreg));
                    Volreg.findByIdAndUpdate(volreg._id, { $set: vreg },
                        { new: true }, (err, doc) => {
                            if (!err){
                                Event.findByIdAndUpdate({ _id: e.eventId },
                                    { eventStatus: 'Closed' }, { new: true, upsert: true },
                                    (err, doc) => {
                                        if (!err)
                                            console.log(' Updated the participants in the event successfully'); //res.send(doc);        
                                        else
                                            res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                                    });
                            }
                                // console.log("Sucessfully updated the post event details for user : " + e.regTo) ///res.send(doc);        
                            else
                                console.log('Error in updating the User: ' + e.regTo + " - " + JSON.stringify(err, undefined, 2));
                        });
                }
            })
    }
    Volreg.find(function (err, volregs) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(volregs);
    });

}

module.exports.bulkUserRegistration = async (req, res, next) => {
    var bEventRegData = [] = req.body;
    var resData = [];
    console.log('Bulk User Reg: ' + JSON.stringify(bEventRegData));
    for (const data of bEventRegData) {
        var uDet = {
            firstName: data.userName,
            lastName: data.userName,
            displayName: data.userName,
            email: data.email,
            buName: data.buName,
            password: '123456',
            empId: data.regTo,
            role: "Normal",
            userStatus: "Active"
        }
        var user = await userCtrl.findAndIUUser(uDet);

        var seatStatus = await echeckCtrl.checkAvailability(data.eventId);

        console.log(JSON.stringify(user));
        //const user = await userCtrl.getUserByEmpId(e.regTo);
        Volreg.findOne({ regTo: user, eventId: data.eventId })
            .then(volreg => {
                if (!volreg) {
                    console.log('Boarding: ' + data.boardingPtDet);
                    var volreg = new Volreg();
                    volreg.regTo = user;
                    volreg.eventId = data.eventId;
                    volreg.regDt = Date.now();
                    volreg.regStatus = data.regStatus;
                    volreg.sourceType = data.sourceType;
                    volreg.transMod = data.transMod;
                    volreg.boardingPtDet = data.boardingPtDet;
                    volreg.buName = data.buName;
                    volreg.seatNo = seatStatus.seatNo;
                    volreg.regStatus = seatStatus.status;
                    volreg.droppingPtDet = data.droppingPtDet;
                    volreg.travelHr = 0;
                    volreg.actualVolHr = 0;
                    volreg.participationStatus = "No Show";
                    volreg.isRegUser = data.isRegUser;
                    volreg.createdBy = data.regTo;
                    volreg.createdDt = Date.now();
                    volreg.updatedBy = data.regTo;
                    volreg.updatedDt = Date.now();
                    console.log("Before Update in volreg: ");
                    volreg.save((err, doc) => {
                        if (!err) {
                            console.log("Volunteering Registration has been completed");

                            console.log("Event ID: " + data.eventId + " | Vol Reg ID: " + doc._id);
                            Event.findByIdAndUpdate({ _id: data.eventId },
                                { $push: { regUsers: doc._id } }, { new: true, upsert: true },
                                (err, doc) => {
                                    if (!err) {
                                        resData.push(doc);
                                        //res.send(doc); //console.log(' Updated the event category: ' + ieventCat + " successfully") //res.send(doc);        
                                        console.log('***********volunteer*************');
                                        console.log({ volreg });
                                        console.log('************************');
                                        //mailer.prepAndSendEmail('volunteer', volreg);
                                        mailCtrl.toSendEmail('bulkvolunteer', volreg);
                                    }
                                    else
                                        res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                                });
                            //res.send(doc);        
                        }
                        else {
                            res.status(422).send(["Something wrong. Please contact Administrator."]);//console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2) );
                        }
                    });
                }
                else {
                    resData.push(volreg);
                }

                // else
                // {             
                //    var vReg = {         
                //       regStatus: 'Registered',
                //       updatedBy: data.regTo,
                //       updatedDt: Date.now()
                //    };
                //    console.log("Re-register: " + JSON.stringify(vReg));
                //    Volreg.findByIdAndUpdate(volreg._id, {$set: vReg}, {new: true}, 
                //       (err, doc) => {
                //          if(err)                      
                //             console.log('Error in updating the User: ' + req.params.id + " - " + JSON.stringify(err, undefined, 2) );
                //    });
                //    //console.log('User is already register to the event');             
                //    //return res.status(200).json({ status: true, message: 'User is already register to the event'});
                //  }
            })
    }
    res.send(resData);
}

module.exports.getBusinessUnits = (req, res) => {
    Volreg.distinct('buName', function (err, buNames) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(buNames);
    })
}

