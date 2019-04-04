const mongoose = require('mongoose');
const Event = mongoose.model('Event');

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
            { new: true }, (err, doc) => {
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

exports.getPendingEvents = function (req, res) {

  Event.aggregate([
    { $sort: { updatedDt: -1 } },
    { $match: { eventStatus: 'Pending' } },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id", as: "proDet"
      }
    },
    { $unwind: '$proDet' },
    {
      $project: {
        "projectName": "$proDet.projectName",
        "benName": 1,
        "baseLocation": 1,
        "council": 1,
        "address": 1,
        "eventCat": 1,
        "eventTitle": 1,
        "eventDesc": 1,
        "numberOfVol": 1,
        "transMod": 1,
        "boardingPtDet": 1,
        "droppingPtDet": 1,
        "startDt": 1,
        "endDt": 1,
        "eventStatus": 1
      }

    }
  ]).exec(function (err, result) {
    if (err)
      return res.status(400).send("error occurred");
    else {
      //console.log(result);
      return res.status(200).send(result);
    }
  });

}
