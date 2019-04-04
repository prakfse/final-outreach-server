const mongoose = require('mongoose');
const _ = require('lodash');
const BulkEvent = mongoose.model('BulkEvent');

exports.getEventDetails = function (req, res) {

  BulkEvent.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id", as: "proDet"
      }
    },
    { $unwind: '$proDet' },
    // {   $match: {"isFavorite": false}},  
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
        "endDt": 1
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
