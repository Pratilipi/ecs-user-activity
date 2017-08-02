// Imports
var express      = require('express');
var testModel	 = require('./models/testModel');
var libraryModel = require('./models/libraryModel');
var followModel = require('./models/followModel');
var testController    = require('./controllers/testController');
var libraryController = require('./controllers/libraryController');
var followController = require('./controllers/followController');
var app = null;

function initializeApp(mysql, config) {
	
	console.log("Initializing app...");
	if (app) {
        return app;
    }
	app = express();
	
	// Health check request
	app.get("/health",function (req,res){
		res.status(200).send("App is healthy!!!!");
	});
	
	// Initialize models
	console.log("Initializing models...");
	var testModelInstance = new testModel(mysql);
	var libraryModelInstance   = new libraryModel( { projectId: process.env.GCP_PROJ_ID || config.GCP_PROJ_ID} );
	var followModelInstance   = new followModel( { projectId: process.env.GCP_PROJ_ID || config.GCP_PROJ_ID} );
	
	// Initialize routes
	console.log("Initializing routes...");
	testController.setTestModel(testModelInstance);
	libraryController.setLibraryModel(libraryModelInstance);
	followController.setFollowModel(followModelInstance);

	// Mapping controllers
	app.use("/test",testController.testRouter);
	app.use("/library",libraryController.libraryRouter);
	app.use("/follows",followController.followRouter);
	
	return app;
}

module.exports = initializeApp;