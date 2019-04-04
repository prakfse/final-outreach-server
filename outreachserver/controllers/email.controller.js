
//mail module
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
creds = require('../config/creds');
mailServer = require('../config/mailServer');
const userCtrl = require("../controllers/user.controller");
const User = mongoose.model('User');

transporter = nodemailer.createTransport({
    service: mailServer.mail_service_provider, //'gmail',
    auth: {
        user: creds.user,
        pass: creds.pass
    },
    port: mailServer.port, //225,
    tls: {
        rejectUnauthorized: false
    }
});

//Email templates
EmailTemplate = require('email-templates').EmailTemplate;
path = require('path');
Promise = require('bluebird');


function sendEmail(obj) {
    return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
    console.log("inside actual loadTemplate :" + templateName);
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context
                }
                );
            });
        });
    }));
}



module.exports.toSendEmail = async (activity, any) => {

    console.log("toSendEmail --:" + activity);
    nUsers = [];

    var adminUsers = await userCtrl.getUsersByRole();

    if (activity == 'events') {
        console.log("inside --:" + activity);
        for (const user of adminUsers) {
            var adminUser = {
                name: user.role,
                email: user.email,
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
                createdBy: any.createdBy,
                updatedBy: any.updatedBy,
                createdBy: any.createdBy,
                updatedBy: any.updatedBy,
                startDt: any.startDt,
                endDt: any.endDt,
                visibleDt: any.visibleDt,
                createdDt: any.createdDt,
                updatedDt: any.updatedDt
            }
            nUsers.push(adminUser);
        }
    } else if (activity == 'updateevents') {
        console.log("inside --:" + activity);
        for (const user of adminUsers) {
            var adminUser = {
                name: user.role,
                email: user.email,
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
                createdBy: any.createdBy,
                updatedBy: any.updatedBy,
                createdBy: any.createdBy,
                updatedBy: any.updatedBy,
                startDt: any.startDt,
                endDt: any.endDt,
                visibleDt: any.visibleDt,
                createdDt: any.createdDt,
                updatedDt: any.updatedDt
            }
            nUsers.push(adminUser);
        }
    } else if (activity == 'bulkevents') {
        for (const user of adminUsers) {
            var adminUser = {
                name: user.role,
                email: user.email
            }
            nUsers.push(adminUser);
        }
    } else if (activity == 'volunteer') {
        console.log("inside --:" + activity);
        var newUser = {
            name: any.regTo.firstName + any.regTo.lastName,
            email: any.regTo.email,
            regTo: any.regTo.empId,
            regName: any.regTo.firstName + any.regTo.lastName,
            eventId: any.eventId,
            regStatus: any.regStatus,
            sourceType: any.sourceType,
            createdBy: any.createdBy,
            createdDt: any.createdDt,
            updatedBy: any.updatedBy,
            updatedDt: any.updatedDt,
            isRegUser: any.isRegUser
        }
        nUsers.push(newUser);

        for (const user of adminUsers) {
            var adminUser = {
                name: any.regTo.firstName + any.regTo.lastName,
                email: user.email,
                regTo: any.regTo.empId,
                regName: any.regTo.firstName + any.regTo.lastName,
                eventId: any.eventId,
                regStatus: any.regStatus,
                sourceType: any.sourceType,
                createdBy: any.createdBy,
                createdDt: any.createdDt,
                updatedBy: any.updatedBy,
                updatedDt: any.updatedDt,
                isRegUser: any.isRegUser
            }
            nUsers.push(adminUser);
        }
    } else if (activity == 'bulkvolunteer') {
        console.log("inside --:" + JSON.stringify(any));
        var newUser = {
            name: any.regTo.firstName + any.regTo.lastName,
            email: any.regTo.email,
            regTo: any.regTo.empId,
            regName: any.regTo.firstName + any.regTo.lastName,
            eventId: any.eventId,
            regStatus: any.regStatus,
            sourceType: any.sourceType,
            createdBy: any.createdBy,
            createdDt: any.createdDt,
            updatedBy: any.updatedBy,
            updatedDt: any.updatedDt,
            isRegUser: any.isRegUser
        }
        console.log("$$$$$$$$$$$$$$ Bulk reg user -- ####\n " + newUser);
        nUsers.push(newUser);
        activity = 'volunteer';
        console.log("BULK REG : " + JSON.stringify(nUsers));
    } else if (activity == 'signup') {
        console.log("inside --:" + activity);
        var newUser = {
            name: any.firstName,
            email: any.email,
            firstName: any.firstName,
            lastName: any.lastName,
            empId: any.empId,
            buName: any.buName,
            userName: any.firstName
        }
        nUsers.push(newUser);
        for (const user of adminUsers) {
            var adminUser = {
                name: user.role,
                email: user.email,
                firstName: any.firstName,
                lastName: any.lastName,
                empId: any.empId,
                buName: any.buName,
                userName: any.firstName
            }
            nUsers.push(adminUser);
        }
    }

    console.log("nUsers ******************" + JSON.stringify(nUsers));

    loadTemplate(activity, nUsers).then((results) => {
        console.log(JSON.stringify(results, null, 4));
        return Promise.all(results.map((result) => {
            sendEmail({
                to: result.context.email,
                from: 'Cognizant Outreach Admin',
                subject: result.email.subject,
                html: result.email.html,
                text: result.email.text
            });
        }));

    }).then(() => {
        console.log("working!!!..");
    }
        );

}



