// check env
var env = process.env.NODE_ENV || "development"

// read the configuration details from config.json
var config = require("./config.json");
var envConfig = config[env];

// add config values to env.process object
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
