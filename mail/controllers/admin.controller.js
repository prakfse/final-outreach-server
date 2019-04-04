const mongoose = require('mongoose');
const User = mongoose.model('User');


// read admin users from users table    
module.exports.getUsersByRole = async () => {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            console.log('inside getUsersByRole');
            User.find({ 'role': { '$in': ["Admin", 'PMO'] } }, function (err, userData) {
                console.log('inside getUsersByRole11');             
                if (err) {
                    console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
                    resolve(null);
                }
                else {
                    // console.log(' Hi : ' + JSON.stringify(userData)) ;
                     console.log("Hhhhhhhhh---"+userData);
                    resolve(userData);
                }
            });
        }, 1000))
}