const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI,  { useNewUrlParser: true }, (err) => {
    if (!err) { console.log("MongoDB connection succeed.") }
    else { console.log("Error in MongoDB connection: " + JSON.stringify(err, undefined, 2)); }
});

require("./user.model");
require("./event.model");
require("./project.model");
require("./volreg.model");
require("./bulkevent.model");
