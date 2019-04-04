const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const Project = mongoose.model('Project');

var ObjectId = mongoose.Types.ObjectId;

module.exports.addProject = (req, res, next) => {
    var project = new Project();
    project.projectName = req.body.projectName;
    project.eventCat = req.body.eventCat;

    project.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code === 11000)
                res.status(422).send(["Duplicate email address found."]);
            else {
                console.log(err);
                return next(err);
            }
        }
    });
}



module.exports.addBulkProjects = (req, res, next) => {
    // var bulkUsers = User.collection.initializeUnorderedBulkOp();
    var projects = [] = req.body;
    console.log('Inside addBulkProjects')
    projects.forEach(e => {
        Project.findOne({ projectName: e.projectName })
            .then(project => {
                if (project) {
                    console.log('Present is => ' + project.projectName);
                    var eCat = [] = project.eventCat;
                    console.log(' Project Id: ' + project._id);
                    //---    
                    e.eventCat.forEach(ieventCat => {
                        console.log('Sub Items: ' + ieventCat);

                        if (eCat.indexOf(ieventCat) > -1)
                            console.log('Event Cat ' + ieventCat + ' is present');
                        else {
                            console.log('Event Cat is not present');
                            //eCat.push(e.eventCat);
                            Project.findByIdAndUpdate({ _id: project._id }, { $push: { eventCat: ieventCat } }, { new: true, upsert: true }, (err, doc) => {
                                if (!err)
                                    console.log(' Updated the event category: ' + ieventCat + " successfully") //res.send(doc);        
                                else
                                    console.log('Error in updating the Event Category: ' + ieventCat + " - " + JSON.stringify(err, undefined, 2));
                            });
                        }
                    })
                } else {
                    console.log('Not Present => ' + e.projectName);
                    console.log('Not Present => ' + e.eventCat);
                    var newProject = new Project();
                    newProject.projectName = e.projectName;
                    newProject.eventCat = e.eventCat;
                    //console.log(JSON.stringify(newProject));
                    newProject.save((err, doc) => {
                        if (!err)
                            console.log('Success'); //res.send(doc);        
                        else {
                            console.log('Error');
                        }
                    });
                }
            })
    })
    Project.find(function (err, projectData) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(projectData);
    });
}

module.exports.findAndIUProject = (req, res, next) => {
    var data = req.body;
    console.log('Inside findAndIUProject: ' + data.projectName);
    Project.findOne({ projectName: data.projectName })
        .then(project => {
            if (project) {
                console.log('Present is => ' + project.projectName);
                var eCat = [] = project.eventCat;
                console.log(' Project Id: ' + project._id);
                if (eCat.indexOf(data.eventCat) > -1)
                    res.send(project);
                else {
                    console.log('Event Cat is not present');
                    //eCat.push(e.eventCat);
                    Project.findByIdAndUpdate({ _id: project._id }, { $push: { eventCat: data.eventCat } }, { new: true, upsert: true }, (err, doc) => {
                        if (!err)
                            res.send(doc);
                        else
                            res.status(422).send(err);
                    });
                }
            } else {
                var newProject = new Project();
                newProject.projectName = data.projectName;
                newProject.eventCat = data.eventCat;
                newProject.save((err, doc) => {
                    if (!err)
                        res.send(doc);
                    else {
                        res.status(422).send(err);
                    }
                });
            }
        })
}

module.exports.asyncFindAndIUProject = (pProject, peventCat) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // var data = req.body;
            console.log('Inside asyncFindAndIUProject: ' + pProject);
            Project.findOne({ projectName: pProject })
                .then(project => {
                    if (project) {
                        console.log('Present is => ' + pProject);
                        var eCat = [] = project.eventCat;
                        console.log(' Project Id: ' + project._id);
                        console.log(' Event Cat: ' + JSON.stringify(eCat));
                        if (eCat.indexOf(peventCat) > -1)
                            resolve(project);
                        else {
                            console.log('Event Cat is not present');
                            //eCat.push(e.eventCat);
                            Project.findByIdAndUpdate({ _id: project._id },
                                { $push: { eventCat: peventCat } },
                                { new: true, upsert: true }, (err, doc) => {
                                    if (!err)
                                        resolve(doc);
                                    else {
                                        console.log('asyncFindAndIUProject ERROR: Fetching the existing project details.')
                                        resolve(null);
                                    }
                                });
                        }
                    } else {
                        var newProject = new Project();
                        newProject.projectName = pProject;
                        newProject.eventCat = peventCat;
                        newProject.save((err, doc) => {
                            if (!err)
                                resolve(doc);
                            else {
                                console.log('asyncFindAndIUProject ERROR: Inserting the project details.')
                                resolve(null);
                            }
                        });
                    }
                })
        }, 500);
    });

}

module.exports.findByProjectName = (req, res) => {
    //var data = req.body;
    Project.findOne({ _id: req.id }, (err, projectData) => {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(projectData);
    });
    console.log(JSON.stringify(data));
}

module.exports.getProjects = (req, res) => {
    Project.find(function (err, projectData) {
        if (err)
            console.log('Error in Retriving Users: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(projectData);
    });
}

module.exports.getProjectNames = (req, res) => {
    Project.distinct('projectName', function (err, projects) {
        if (err)
            console.log('Error in Retriving events: ' + JSON.stringify(err, undefined, 2));
        else
            res.send(projects);
    });

}
