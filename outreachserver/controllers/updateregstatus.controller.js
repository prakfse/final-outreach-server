const mongoose = require('mongoose');
const Volreg = mongoose.model('Volreg');

const Event = mongoose.model('Event');


module.exports.doUpdateRegStatus = async (pEventId) => {
    return new Promise((resolve, reject) => {
        console.log(pEventId);
        setTimeout(() => {
            Event.findOne({ _id: new mongoose.Types.ObjectId(pEventId) })
                .then(eve => {
                    if (eve) {
                        console.log('Event is present');
                        Volreg.update({
                            $and: [{
                                eventId: new mongoose.Types.ObjectId(pEventId),
                                regStatus: 'WL'
                            }]
                        }, { $set: { $inc: { seatNo: -1 } } },
                            { new: true }, (err, docs) => {
                                if (!err) {
                                    console.log('Decrease the seat No');
                                    Volreg.updateOne({
                                        $and: [{
                                            eventId: new mongoose.Types.ObjectId(pEventId),
                                            regStatus: 'WL', seatNo: 0
                                        }]
                                    },
                                        { $set: { regStatus: 'Confirmed' } },
                                        { new: true }, (err, doc) => {
                                            if (!err) {
                                                console.log(JSON.stringify(doc));
                                                resolve(doc);
                                            }
                                            else {
                                                console.log('Not updated the confirmed status');
                                                resolve(null);
                                            }
                                        }
                                    )
                                }
                                else {
                                    console.log('Not decrease the seat no.');
                                    resolve(null);
                                }
                            })
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