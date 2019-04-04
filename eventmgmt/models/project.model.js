const mongoose = require("mongoose");

//require("./config/config");


var projectSchema = mongoose.Schema({
    projectName: { type: String, required: "Project Name can't be empty." },
    eventCat: { type: Array, required: "Project Name can't be empty." }
});


mongoose.model('Project', projectSchema);