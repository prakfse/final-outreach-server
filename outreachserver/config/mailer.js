//mail module
const nodemailer = require('nodemailer');
creds = require('../config/creds');
transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : creds.user,
        pass : creds.pass
    },
    port : 225,
    tls : {
        rejectUnauthorized : false
    }
});
EmailTemplate = require('email-templates').EmailTemplate;
path = require('path');
Promise = require('bluebird');


function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts){
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err,result) => {
                if (err) reject(err);
                else resolve({
                    email : result,
                    context
                }
                );
            });
        });
    }));
}

var methods = {
    prepAndSendEmail : function (activity, any){
        console.log('Type : --'+activity );
        //console.log({any});
        {{any}}

        if (activity == 'signup'){
            // nUsers = [
            //     // {
            //     // name : any.name,
            //     // email : any.email,
            //     // firstName : any.firstName,
            //     // lastName :any.lastName,
            //     // empId :any.empId
            //     // },
            //     {
            //         name : 'Admin',
            //         email : 'prakashrajumca@gmail.com',
            //         name : any.name,
            //         email : any.email,
            //         firstName : any.firstName,
            //         lastName :any.lastName,
            //         empId :any.empId
            //     }

            // ]

            nUsers = [
                {
                    name : 'Admin',
                    email : 'prakashrajumca@gmail.com'
                },
                {
                    name : 'PMO',
                    email : "jtechsiva@gmail.com"
                },
                // {
                //     name : user.firstName,
                //     email : user.email
                // }
            ] 
        } else 
        if (activity == 'bulkevents'){
            // nUsers = [
            //     // {
            //     // name : any.name,
            //     // email : any.email,
            //     // firstName : any.firstName,
            //     // lastName :any.lastName,
            //     // empId :any.empId
            //     // },
            //     {
            //         name : 'Admin',
            //         email : 'prakashrajumca@gmail.com',
            //         name : any.name,
            //         email : any.email,
            //         firstName : any.firstName,
            //         lastName :any.lastName,
            //         empId :any.empId
            //     }

            // ]

            nUsers = [
                {
                    name : 'Admin',
                    email : 'prakashrajumca@gmail.com'
                },
                {
                    name : 'PMO',
                    email : "jtechsiva@gmail.com"
                },
                // {
                //     name : user.firstName,
                //     email : user.email
                // }
            ] 
        } 
        
        
        else
        
        if (activity == 'events' ){

            nUsers = [
                {
                    name : 'Admin',
                    email : 'prakashrajumca@gmail.com',

                    createdVia: any.createdVia,
                    eventStatus: any.eventStatus,
                  
                    benName: any.benName,
                    baseLocation: any.baseLocation,
                    council: any.council,
                    address: any.address,
                    pocID: any.pocID,
                    pocDet: any.pocDet,
                    project: any.project,
                    eventCat: any.eventCat,
                    eventTitle: any.eventTitle,
                    eventDesc: any.eventDesc,
                    numberOfVol: any.numberOfVol,
                    // transMod: 'None',
                    // boardingPtDet: 'bp',
                    // droppingPtDet: 'dp',
                    createdBy: any.createdBy,
                    updatedBy: any.updatedBy,
                    createdBy: any.createdBy,
                    updatedBy: any.updatedBy,
                    startDt: any.startDt,
                    endDt: any.endDt,
                    visibleDt: any.visibleDt,
                    createdDt: any.createdDt,
                    updatedDt: any.updatedDt
                },
                {
                    name : 'PMO',
                    email : "jtechsiva@gmail.com",

                    createdVia: any.createdVia,
                    eventStatus: any.eventStatus,
                  
                    benName: any.benName,
                    baseLocation: any.baseLocation,
                    council: any.council,
                    address: any.address,
                    pocID: any.pocID,
                    pocDet: any.pocDet,
                    project: any.project,
                    eventCat: any.eventCat,
                    eventTitle: any.eventTitle,
                    eventDesc: any.eventDesc,
                    numberOfVol: any.numberOfVol,
                    // transMod: 'None',
                    // boardingPtDet: 'bp',
                    // droppingPtDet: 'dp',
                    createdBy: any.createdBy,
                    updatedBy: any.updatedBy,
                    startDt: any.startDt,
                    endDt: any.endDt,
                    visibleDt: any.visibleDt,
                    createdDt: any.createdDt,
                    updatedDt: any.updatedDt
                    
                }
            ]
        } else 

        if (activity == 'volunteer'){
            
                        nUsers = [
                            {
                                name : 'Admin',
                                email : 'prakashrajumca@gmail.com',

                                regTo :any.regTo,
                                regName : "Prakash raju", 
                                eventId: any.eventId,
                                regStatus : any.regStatus,
                                sourceType : any.sourceType,
                                createdBy : any.createdBy,
                                createdDt: any.createdDt,
                                updatedBy: any.updatedBy,
                                updatedDt: any.updatedDt,
                                isRegUser: any.isRegUser
            
                            },
                            {
                                name : 'PMO',
                                email : "jtechsiva@gmail.com",
      
                                regTo :any.regTo, 
                                regName : "Sivagurunathan Mariappan",
                                eventId: any.eventId,
                                regStatus : any.regStatus,
                                sourceType : any.sourceType,
                                createdBy : any.createdBy,
                                createdDt: any.createdDt,
                                updatedBy: any.updatedBy,
                                updatedDt: any.updatedDt,
                                isRegUser: any.isRegUser
                                
                            }
                            // {
                            //     name : req.body.firstName,
                            //     email : req.body.email,
                                    // regTo :volreg.regTo, 
                                    // eventId: volreg.eventId,
                                    // regStatus : volreg.regStatus,
                                    // sourceType : volreg.sourceType,
                                    // createdBy : volreg.createdBy,
                                    // createdDt: volreg.createdDt,
                                    // updatedBy: volreg.updatedBy,
                                    // updatedDt: volreg.updatedDt,
                                    // isRegUser: volreg.isRegUser
                            // }
                        ]
                    }

                   // nUsers = any;
        loadTemplate(activity, nUsers).then((results) => {
           // console.log(JSON.stringify(results, null, 4));
            return Promise.all(results.map((result) => {
                sendEmail({
                    to : result.context.email,
                    from : 'Outreach Admin',
                    subject : result.email.subject,
                    html : result.email.html,
                    text : result.email.text
                });
            }));
            
        }).then( () => {
            console.log ("working!!!..");
        }
        );
    }
}

//exports.data = methods;
module.exports = methods;