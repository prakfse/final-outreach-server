const mongoose = require('mongoose');
const Volreg = mongoose.model('Volreg');

const Event = mongoose.model('Event');


module.exports.checkAvailability = async (pEventId) => {
      return new Promise((resolve, reject) => {
            //var pEventId = req;// req.params.eid;
            console.log(pEventId);
            setTimeout(() => {
                  Event.findOne({ _id: new mongoose.Types.ObjectId(pEventId) })
                        .then(eve => {
                              if (eve) {
                                    var volKnt = eve.numberOfVol;
                                    var resUserKnt = eve.regUsers.length + 1;
                                    console.log('Total Vol: ' + volKnt + "; Total Reg Users: " + resUserKnt);
                                    if (volKnt < resUserKnt) {
                                          var wlKnt = 0;
                                          Volreg.find({
                                                $and: [{
                                                      eventId: new mongoose.Types.ObjectId(pEventId),
                                                      regStatus: 'WL'
                                                }]
                                          })
                                                .then(docs => {
                                                      if (!docs) wlKnt = 0;
                                                      else {
                                                            wlKnt = docs.length;
                                                            console.log('eeee: ' + wlKnt);
                                                            wlKnt = wlKnt + 1;
                                                            console.log('WL: ' + wlKnt);
                                                            var retVal = {
                                                                  status: 'WL',
                                                                  seatNo: wlKnt
                                                            }
                                                            console.log(JSON.stringify(retVal));
                                                            //res.send('WL');
                                                            resolve(retVal);
                                                      }
                                                })
                                    }
                                    else {
                                          var retVal = {
                                                status: 'Confirmed',
                                                seatNo: 0
                                          }
                                          console.log('Available');
                                          //res.send('C');
                                          resolve(retVal);
                                    }
                              }
                              else {
                                    var retVal = {
                                          status: 'Confirmed',
                                          seatNo: 0
                                    }
                                    //res.send('C');
                                    resolve(retVal);
                              }
                        });
            }, 500);
      });
}