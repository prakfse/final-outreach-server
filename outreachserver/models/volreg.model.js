const mongoose = require("mongoose");

var volregSchema = mongoose.Schema({
    regTo: { type: mongoose.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Types.ObjectId, ref: 'Event' },
    regDt: { type: Date },
    regStatus: { type: String },
    sourceType: { type: String },
    travelHr: { type: Number },
    boardingPtDet: { type: String },
    droppingPtDet: { type: String },
    transMod: { type: String },
    buName: { type: String },
    actualVolHr: { type: Number },
    participationStatus: { type: String },
    isRegUser: { type: Boolean },
    seatNo: { type: Number },
    createdBy: { type: String },
    createdDt: { type: Date },
    updatedBy: { type: String },
    updatedDt: { type: Date }
});


mongoose.model('Volreg', volregSchema);