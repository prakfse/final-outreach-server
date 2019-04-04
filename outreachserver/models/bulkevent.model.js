const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//require("./config/config");


var bulkeventSchema = mongoose.Schema({
    benName: { type: String, required: "Beneficiary Name can't be empty." },
    baseLocation: { type: String, required: "Base location can't be empty." },
    council: { type: String, required: "Council Name can't be empty." },
    address: { type: String, required: "Address can't be empty." },
    pocID: { type: String, required: "POC ID can't be empty." },
    pocDet: { type: String, required: "POC details can't be empty." },
    project: { type: String, required: "Project Name can't be empty." },
    regUsers: { type: Array, default: null },
    eventCat: { type: String, required: "Event Category can't be empty." },
    eventTitle: { type: String, required: "Event title can't be empty." },
    eventDesc: { type: String, required: "Event description can't be empty." },
    numberOfVol: { type: Number, required: "No. Of Volunteer can't be empty." },
    transMod: { type: String, required: "Transport mode can't be empty." },
    boardingPtDet: { type: String, required: "Boarding point can't be empty." },
    droppingPtDet: { type: String, required: "Droping point can't be empty." },
    startDt: { type: Date, default: Date.now, required: "Start date can't be empty." },
    endDt: { type: Date, default: Date.now, required: "End date can't be empty." },
    visibleDt: { type: Date, default: Date.now, required: "Visible date can't be empty." },
    isFavorite: { type: Boolean, default: false },
    createdBy: { type: String },
    createdDt: { type: Date, default: Date.now },
    updatedBy: { type: String },
    updatedDt: { type: Date, default: Date.now },
    createdVia: { type: String, default: "Normal" },
    eventStatus: { type: String, default: "Pending" }
});


mongoose.model('BulkEvent', bulkeventSchema);

