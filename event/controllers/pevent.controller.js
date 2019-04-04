const mongoose = require('mongoose');
const _ = require('lodash');
const Event = mongoose.model('Event');

module.exports.getEventDetails = function (req, res) {
  // console.log('getEventDetails');
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
    {
      $lookup: {
        from: "users",
        localField: "vReg.regTo",
        foreignField: "_id", as: "rUsers"
      }
    },

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
        "eventStatus": 1,
        "isFavorite": 1,
        "vReg.regDt": 1,
        "vReg.regTo": 1,
        "vReg.transMod": 1,
        "vReg.boardingPtDet": 1,
        "vReg.droppingPtDet": 1,
        "vReg.regStatus": 1,
        "vReg.sourceType": 1,
        "vReg.travelHr": 1,
        "vReg.actualVolHr": 1,
        "vReg.participationStatus": 1,
        "vReg.isRegUser": 1,
        "rUsers._id": 1,
        "rUsers.empId": 1,
        "rUsers.email": 1,
        "rUsers.displayName": 1
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

};

module.exports.getPendingEvents = function (req, res) {

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

module.exports.getEventDetailById = function (req, res) {
  // console.log('getEventDetailById : ' + req.params.eid );
  Event.aggregate([
    { $match: { '_id': new mongoose.Types.ObjectId(req.params.eid) } },
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
    {
      $lookup: {
        from: "users",
        localField: "vReg.regTo",
        foreignField: "_id", as: "rUsers"
      }
    },

    {
      $project: {
        "projectName": "$proDet.projectName",
        "benName": 1,
        "baseLocation": 1,
        "council": 1,
        "address": 1,
        "eventCat": 1,
        "pocID": 1,
        "pocDet": 1,
        "eventTitle": 1,
        "eventDesc": 1,
        "numberOfVol": 1,
        "transMod": 1,
        "boardingPtDet": 1,
        "droppingPtDet": 1,
        "visibleDt": 1,
        "startDt": 1,
        "endDt": 1,
        "vReg.regDt": 1,
        "vReg.regTo": 1,
        "vReg.transMod": 1,
        "vReg.boardingPtDet": 1,
        "vReg.droppingPtDet": 1,
        "vReg.regStatus": 1,
        "vReg.sourceType": 1,
        "vReg.travelHr": 1,
        "vReg.actualVolHr": 1,
        "vReg.participationStatus": 1,
        "vReg.isRegUser": 1,
        //  "vReg.regTo.empId" : 1,
        "rUsers._id": 1,
        "rUsers.empId": 1,
        "rUsers.email": 1,
        "rUsers.displayName": 1
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

module.exports.getEventDetailsForRegUsers = function (req, res) {
  // console.log('getEventDetails');
  Event.aggregate([
    { $sort: { updatedDt: -1 } },
    { $match: { eventStatus: 'Approved' } },
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
    {
      $lookup: {
        from: "users",
        localField: "vReg.regTo",
        foreignField: "_id", as: "rUsers"
      }
    },
    { $match: { "eventStatus": "Approved" } },
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
        "eventStatus": 1,
        "vReg.regDt": 1,
        "vReg.eventId": 1,
        "vReg.regTo": 1,
        "vReg.transMod": 1,
        "vReg.boardingPtDet": 1,
        "vReg.droppingPtDet": 1,
        "vReg.regStatus": 1,
        "vReg.sourceType": 1,
        "vReg.travelHr": 1,
        "vReg.actualVolHr": 1,
        "vReg.participationStatus": 1,
        "vReg.isRegUser": 1,
        "rUsers._id": 1,
        "rUsers.empId": 1,
        "rUsers.email": 1,
        "rUsers.buName": 1,
        "rUsers.displayName": 1
      }

    }
  ]).exec(function (err, result) {
    if (err)
      return res.status(400).send("error occurred");
    else {
      //console.log(result);
      return res.status(200).send(result);
    }
  })
}

module.exports.getEventDetailsByUser = function (req, res) {
  var strLoggedUser = req.params.uid;
  // console.log('getEventDetailsByUser : ' + strLoggedUser);
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
    { $match: { 'rUsers.empId': strLoggedUser } },
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
        "vReg.regDt": 1,
        "vReg.bpt": 1,
        "vReg.regStatus": 1,
        "vReg.sourceType": 1,
        "vReg.travelHr": 1,
        "vReg.actualVolHr": 1,
        "vReg.participationStatus": 1,
        "vReg.isRegUser": 1,
        "rUsers.empId": 1,
        "rUsers.email": 1,
        "rUsers.displayName": 1
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
};

module.exports.getPendingEventDetails = function (req, res) {
  var strLoggedUser = req.params.uid;
  console.log(strLoggedUser);
  Event.aggregate([
    // {   $match: {"isFavorite": false}},  
    { $match: { 'eventStatus': 'Pending' } },
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
        localField: "regUsers",
        foreignField: "_id", as: "rUsers"
      }
    },

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
        "rUsers.regTo": 1,
        "rUsers.regDt": 1,
        "rUsers.regStatus": 1
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
};

module.exports.getEventDetailsById = function (req, res) {
  var strLoggedUser = req.params.eid;
  console.log(req.params.eid);
  Event.aggregate([
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
        localField: "regUsers",
        foreignField: "_id", as: "rUsers"
      }
    },
    { $match: { id: strLoggedUser } },
    {
      $project: {
        "projectName": "$proDet.projectName",
        "_id": 1,
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
        "rUsers": 1,
        "uInfo": 1
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
};

