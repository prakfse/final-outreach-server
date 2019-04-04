const mongoose = require('mongoose');
const _ = require('lodash');
const Event = mongoose.model('Event');


exports.getEventSummary = function (req, res) {
   console.log('6001: getEventDetails');
  Event.aggregate([
    { $sort: { updatedDt: -1 } },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id", as: "proDet"
      }
    },
    { $unwind: '$proDet' },
    {
      $lookup: {
        from: "volregs",
        localField: "_id",
        foreignField: "eventId", as: "vReg"
      }
    },
    { $unwind: '$vReg' },
    {
      $lookup: {
        from: "users",
        localField: "vReg.regTo",
        foreignField: "_id", as: "rUsers"
      }
    },
    { $unwind: '$rUsers' },
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
        "boardingPtDet": '$vReg.boardingPtDet',
        "droppingPtDet": '$vReg.droppingPtDet',
        "startDt": 1,
        "endDt": 1,
        "eventStatus": 1,
        "empId": '$rUsers.empId',
        "empName": '$rUsers.displayName',
        "buName": '$rUsers.buName',
        "travelHr": '$vReg.travelHr',
        "actualVolHr": '$vReg.actualVolHr',
        "transMod": '$vReg.transMod',
        "regStatus": '$vReg.regStatus',
        "participationStatus": '$vReg.participationStatus',
        'regDt': '$vReg.updatedDt'
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