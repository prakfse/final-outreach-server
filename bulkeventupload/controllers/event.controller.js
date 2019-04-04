const mongoose = require('mongoose');
const request = require("request");
const Event = mongoose.model('Event');

const projectCtrl = require("../controllers/project.controller");


module.exports.asyncAddBulkEvents = async (req, res) => {
    var bulkEvents = Event.collection.initializeUnorderedBulkOp();
    var data = [] = req.body;
    console.log('asyncAddBulkEvents inside');
    for (const e of data) {
        console.log('Bulk Event : ' + e.benName + " -- " + e.project);
        const tProjectId = await projectCtrl.asyncFindAndIUProject(e.project, e.eventCat);
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
        bulkEvent.visibleDt = Date.now();
        bulkEvent.isFavorite = e.isFavorite;
        bulkEvent.createdBy = e.createdBy;
        bulkEvent.createdDt = Date.now();
        bulkEvent.updatedBy = e.updatedBy;
        bulkEvent.updatedDt = Date.now();
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
            console.log('***********BULK EVENT*************');

            // mailCtrl.toSendEmail('bulkevents', bulkEvents);
            mailforBulkEvent("bulkevents", bulkEvents);
        }
    });
}

function mailforBulkEvent(activity, event) {
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
