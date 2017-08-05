// Imports
var express      = require('express');
var logger = require('morgan');
var testModel	 = require('./models/testModel');
var libraryModel = require('./models/libraryModel');
var followModel  = require('./models/followModel');
var testController    = require('./controllers/testController');
var libraryController = require('./controllers/libraryController');
var followController  = require('./controllers/followController');
var app = null;

function initializeApp(mysql, config) {
	
	console.log("Initializing app...");
	if (app) {
        return app;
    }
	app = express();
	
	app.use(logger('short'));
	
	// Health check request
	app.get("/health",function (req,res){
		res.status(200).send("App is healthy!!!!");
	});
	
	// Initialize models
	console.log("Initializing models...");
	var testModelInstance = new testModel(mysql);
	var libraryModelInstance   = new libraryModel( { projectId: process.env.GCP_PROJ_ID || config.GCP_PROJ_ID} );
	var followModelInstance   = new followModel( { projectId: process.env.GCP_PROJ_ID || config.GCP_PROJ_ID} );
	
	
	console.log("Initializing routes...");
	app.use("/test",new testController(testModelInstance).testRouter);
	
	
	return app;
}

module.exports = initializeApp;