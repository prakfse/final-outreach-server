
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const BulkEvent = mongoose.model('BulkEvent');

const Project = mongoose.model('Project');

var ObjectId = mongoose.Types.ObjectId;


module.exports.addBulkEvents = (req, res, next) => {
    var bulkEvents = BulkEvent.collection.initializeUnorderedBulkOp();
    var data = [] = req.body;

    data.forEach(e => {
        console.log('Bulk Event : ' + e.benName + " -- " + e.project);
        var bulkEvent = new BulkEvent();
        bulkEvent.benName = e.benName;
        bulkEvent.baseLocation = e.baseLocation;
        bulkEvent.council = e.council;
        bulkEvent.address = e.address;
        bulkEvent.pocID = e.pocID;
        bulkEvent.pocDet = e.pocDet;
        bulkEvent.project = e.project;
        bulkEvent.regUsers = e.regUsers;
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
        }
    });
}