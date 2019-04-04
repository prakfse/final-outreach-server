const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports.asyncFindAndIUProject = (pProject, peventCat) => {
    return new Promise((resolve) => {
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
