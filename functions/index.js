// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const bodyParser = require('body-parser');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({timestampsInSnapshots: true});

const E = require('./Engine/CondutionEngine');

E.start({admin}, "fb-admin");
E.use("fb-admin");

exports.addTask = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    // Send back a message that we've succesfully written the message
    
    let uid = req.query.uid;
    let ntObject = {
      desc: req.query.desc ? req.query.desc : "",
      isFlagged: false,
      isFloating: true,
      isComplete: false,
      project: "",
      tags: [],
      timezone: req.query.tz ? req.query.tz : "America/Los_Angeles",
      repeat: {rule: "none"},
      name: req.query.name ? req.query.name : "",
    };
    E.db.newTask(uid, ntObject).then(function(ntid) {
      res.json({result: "success", uid, payload: {taskId:ntid, taskObject: ntObject}})
       return;
    }).catch(function(error) {
      console.log(error);
      //res.json({result: "error", message: "There was an error writing your file", error: error});
      res.send(500, JSON.stringify({result: "error", payload: error}))
    });
});

exports.parseEmail = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    // Send back a message that we've succesfully written the message
    let j = req.body;
    let uid = req.query.uid;
    let ntObject = {
        desc: j.plain,
        isFlagged: false,
        isFloating: true,
        isComplete: false,
        project: "",
        tags: [],
        timezone: req.query.tz ? req.query.tz : "America/Los_Angeles",
        repeat: {rule: "none"},
        name: j.headers.subject,
    }

    E.db.newTask(uid, ntObject).then(function(ntid) {
      res.json({result: "success", uid, payload: {taskId:ntid, taskObject: ntObject}});
       return;
    }).catch(function(error) {
      console.log(error);
      //res.json({result: "error", message: "There was an error writing your file", error: error});
      res.send(500, JSON.stringify({result: "error", payload: error}))
    });
});



