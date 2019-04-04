const mongoose = require('mongoose');
const request = require("request");



const Event = mongoose.model('Event');

var ObjectId = mongoose.Types.ObjectId;

module.exports.addEvent = (req, res, next) => {
    var event = new Event();
    event.benName = req.body.benName;
    event.baseLocation = req.body.baseLocation;
    event.council = req.body.council;
    event.address = req.body.address;
    event.regUsers = [];
    event.pocID = req.body.pocID;
    event.pocDet = req.body.pocDet;
    event.project = req.body.project;
    event.eventCat = req.body.eventCat;
    event.eventTitle = req.body.eventTitle;
    event.eventDesc = req.body.eventDesc;
    event.numberOfVol = req.body.numberOfVol;
    event.transMod = req.body.transMod;
    event.boardingPtDet = req.body.boardingPtDet;
    event.droppingPtDet = req.body.droppingPtDet;
    event.startDt = Date.now();
    event.endDt = Date.now();
    event.visibleDt = Date.now();
    event.isFavorite = req.body.isFavorite;
    event.createdBy = req.body.createdBy;
    event.createdDt = Date.now();
    event.updatedBy = req.body.updatedBy;
    event.updatedDt = Date.now();

    event.save((err, doc) => {
        if (!err) {
            res.send(doc);

            console.log("**********ADDD EVENT ***********");
            mailforEvent("events", event);

        }
        else {
            console.log('Error in adding the event detail: ' + err);
            return next(err);
        }
    });
}




module.exports.getEvents = (req, res) => {
    Event.find(function (err, eventData) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(eventData);
    });

}

module.exports.getEvent = (req, res) => {

    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No event record found with given id: ' + req.params.id);
    else {
        Event.findById(req.params.id, function (err, eventData) {
            if (err)
                console.log('Error in Retriving Event: ' + JSON.stringify(err, undefined, 2));
            else
                res.send(eventData);
        });
    }
}

module.exports.updateEvent = async (req, res) => {
    console.log('Before Inside:  ' + req.params.id);
    if (!ObjectId.isValid(req.params.id)){
        console.log('No event record found with given id: ' + req.params.id);
        return res.status(400).send('No event record found with given id: ' + req.params.id);
    }
    else {
        // console.log('Valid Event ID');
        var event = {
            benName: req.body.benName,
            baseLocation: req.body.baseLocation,
            council: req.body.council,
            address: req.body.address,
            pocID: req.body.pocID,
            pocDet: req.body.pocDet,
            project: req.body.project,
            eventCat: req.body.eventCat,
            eventTitle: req.body.eventTitle,
            eventDesc: req.body.eventDesc,
            numberOfVol: req.body.numberOfVol,
            transMod: req.body.transMod,
            boardingPtDet: req.body.boardingPtDet,
            droppingPtDet: req.body.droppingPtDet,
            startDt: req.body.startDt,
            endDt: req.body.endDt,
            visibleDt: req.body.visibleDt,
            isFavorite: req.body.isFavorite,
            updatedBy: req.body.updatedBy,
            updatedDt: Date.now()
        };

        console.log('Before Update: ' + JSON.stringify(event));
        Event.findByIdAndUpdate(req.params.id, { $set: event },
            { new: true }, (err, doc) => {
                if (!err) {
                    res.send(doc);
                    // mailCtrl.toSendEmail('updateevents', event);
                    console.log("**********UPDATE EVENT ***********");
                    mailforEvent("updateevents", doc);
                }
                else
                    console.log('Error in updating the Event: ' + req.params.id + " - " + JSON.stringify(err, undefined, 2));
            });
    }
}


module.exports.deleteEvent = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No Event record found with given id: ' + req.params.id);
    else
        Event.findByIdAndRemove(req.params.id, (err, event) => {
            if (!err)
                return res.send(event);
            else
                return console.log('Error in Event delete: ' + JSON.stringify(err, undefined, 2));
        }
        )
}


module.exports.addBulkEvents = (req, res) => {
    var bulkEvents = Event.collection.initializeUnorderedBulkOp();
    var data = [] = req.body;

    data.forEach(e => {
        var bulkEvent = new Event();
        bulkEvent.benName = e.benName;
        bulkEvent.baseLocation = e.baseLocation;
        bulkEvent.council = e.council;
        bulkEvent.address = e.benName + "; " + e.baseLocation;
        bulkEvent.pocID = e.pocID;
        bulkEvent.pocDet = e.pocDet;
        bulkEvent.project = e.project;
        bulkEvent.regUsers = [];
        bulkEvent.eventCat = e.eventCat;
        bulkEvent.eventTitle = e.eventTitle;
        bulkEvent.eventDesc = e.eventDesc;
        bulkEvent.numberOfVol = e.numberOfVol;
        bulkEvent.transMod = e.transMod;
        bulkEvent.boardingPtDet = e.boardingPtDet;
        bulkEvent.droppingPtDet = e.droppingPtDet;
        bulkEvent.startDt = e.startDt;
        bulkEvent.endDt = e.endDt;
        bulkEvent.visibleDt = e.visibleDt;
        bulkEvent.isFavorite = e.isFavorite;
        bulkEvent.createdBy = e.createdBy;
        bulkEvent.createdDt = e.createdDt;
        bulkEvent.updatedBy = e.updatedBy;
        bulkEvent.updatedDt = e.updatedDt;
        bulkEvent.createdVia = e.createdVia;
        bulkEvent.eventStatus = e.eventStatus;
        bulkEvents.insert(bulkEvent);
        console.log(JSON.stringify(bulkEvent));
    });

    bulkEvents.execute(function (err, uDoc) {
        if (err) {
            console.log('Error while executing the bulk user upload.');
            console.log(err);
            res.status(422).send(["Error while executing the bulk user upload."]);
        }
        else {
            console.log('Sucessfully executed the Bulk user update operations.');
            res.send(uDoc);
            //mailer.prepAndSendEmail('bulkevents', bulkEvents); 
            //mailCtrl.toSendEmail('bulkevents', bulkEvents); 
        }
    });
}

module.exports.asyncAddBulkEvents = async (req, res) => {
    var bulkEvents = Event.collection.initializeUnorderedBulkOp();
    var data = [] = req.body;
    console.log('asyncAddBulkEvents inside');
    for (const e of data) {
        console.log('Bulk Event : ' + e.benName + " -- " + e.project);
        var tProjectId = await projectCtrl.asyncFindAndIUProject(e.project, e.eventCat);
        var bulkEvent = new Event();
        bulkEvent.benName = e.benName;
        bulkEvent.baseLocation = e.baseLocation;
        bulkEvent.council = e.council;
        bulkEvent.address = e.benName + "; " + e.baseLocation;
        bulkEvent.pocID = e.pocID;
        bulkEvent.pocDet = e.pocDet;
        if (tProjectId != null)
            bulkEvent.project = tProjectId;
        else
            bulkEvent.project = null;

        bulkEvent.regUsers = [];
        bulkEvent.eventCat = e.eventCat;
        bulkEvent.eventTitle = e.eventTitle;
        bulkEvent.eventDesc = e.eventDesc;
        bulkEvent.numberOfVol = e.numberOfVol;
        bulkEvent.transMod = e.transMod;
        bulkEvent.boardingPtDet = e.boardingPtDet;
        bulkEvent.droppingPtDet = e.droppingPtDet;
        bulkEvent.startDt = e.startDt;
        bulkEvent.endDt = e.endDt;
        bulkEvent.visibleDt = e.visibleDt;
        bulkEvent.isFavorite = e.isFavorite;
        bulkEvent.createdBy = e.createdBy;
        bulkEvent.createdDt = e.createdDt;
        bulkEvent.updatedBy = e.updatedBy;
        bulkEvent.updatedDt = e.updatedDt;
        bulkEvent.createdVia = e.createdVia;
        bulkEvent.eventStatus = e.eventStatus;
        bulkEvents.insert(bulkEvent);
        console.log(JSON.stringify(bulkEvent));
    }

    bulkEvents.execute(function (err, uDoc) {
        if (err) {
            console.log('Error while executing the bulk user upload.');
            console.log(err);
            res.status(422).send(["Error while executing the bulk user upload."]);
        }
        else {
            console.log('Sucessfully executed the Bulk user update operations.');
            res.send(uDoc);
            console.log('***********Bulk evet*************');

            // mailCtrl.toSendEmail('bulkevents', bulkEvents);
        }
    });
}

module.exports.updateBulkEventStatus = (req, res) => {
    var data = [] = req.body;
    data.forEach(e => {
        console.log(e._id);
        var event = {
            updatedBy: req.params.uid,
            eventStatus: req.params.estatus,
            updatedDt: Date.now()
        };
        console.log('Before Update: ' + JSON.stringify(event));
        Event.findByIdAndUpdate(e._id, { $set: event },
            { new: true }, (err) => {
                if (!err)
                    console.log("Sucessfully updated the post event details for user : " + e.regTo) ///res.send(doc);        
                else
                    console.log('Error in updating the event: ' + e.benName + " - " + JSON.stringify(err, undefined, 2));
            });
    });

    Event.find(function (err, eventDet) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(eventDet);
    });

}


module.exports.asyncTest = async (req, res) => {
    var name = [] = req.body
    for (const n of name) {
        var msg = await userCtrl.getMessage(n.name);
        console.log(msg);
    }
    res.status(200).send({ message: 'Async method has been completed.' })
}

module.exports.asyncAddUsers = async (req, res) => {
    var users = [] = req.body
    for (const u of users) {
        var user = {
            firstName: u.firstName,
            lastName: u.lastName,
            displayName: u.displayName,
            email: u.email,
            password: u.password,
            empId: u.empId,
            role: "Normal",
            userStatus: "Active"
        }
        var msg = await userCtrl.asyncAddUser(user);
        if (msg != null)
            console.log("User ID: " + msg._id);
        else
            console.log("Something went wrong. Please check with Administrator");
    }
    res.status(200).send({ message: 'Async method has been completed.' })
}

module.exports.asyncAddUser = async (req, res) => {
    var u = req.body
    var user = {
        firstName: u.firstName,
        lastName: u.lastName,
        displayName: u.displayName,
        email: u.email,
        password: u.password,
        empId: u.empId,
        role: "Normal",
        userStatus: "Active"
    }
    var msg = await userCtrl.asyncAddUser(user);
    if (msg != null)
        console.log("User ID: " + msg._id);
    else
        console.log("Something went wrong. Please check with Administrator");

    res.status(200).send({ message: 'Async method has been completed.' })
}


module.exports.getLocations = (req, res) => {
    Event.distinct('baseLocation', function (err, locations) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(locations);
    });

}

module.exports.getCouncils = (req, res) => {
    Event.distinct('council', function (err, locations) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(locations);
    });

}
function mailforEvent(activity, event) {
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