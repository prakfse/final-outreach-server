// Gruntfile.js
module.exports = function(grunt) {

   grunt.initConfig({

     // configure nodemon
     shell: {
       command: [
           "npm i",
           "npm update -g npm"           
           ].join('&&')
       } ,
   nodemon: {
       dev: {
         script: 'app.js'
       }
     }

   });

   // load nodemon
   grunt.loadNpmTasks('grunt-shell');
   grunt.loadNpmTasks('grunt-nodemon');

   // register the nodemon task when we run grunt
   grunt.registerTask('default', ['shell','nodemon']);

 };