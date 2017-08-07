// Imports
var express      = require('express');
var logger = require('morgan');
var testModel	 = require('./models/testModel');
var libraryModel = require('./models/libraryModel');
var followModel  = require('./models/followModel');
var rateReviewModel = require('./models/rateReviewModel');
var commentModel = require('./models/commentModel');
var voteModel = require('./models/voteModel');
var testController    = require('./controllers/testController');
var libraryController = require('./controllers/libraryController');
var followController  = require('./controllers/followController');
var rateReviewController = require('./controllers/rateReviewController');
var commentController = require('./controllers/commentController');
var voteController = require('./controllers/voteController');
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
	var rateReviewModelInstance = new rateReviewModel(mysql);
	var commentModelInstance = new commentModel(mysql);
	var voteModelInstance = new voteModel(mysql);
	
	
	console.log("Initializing routes...");
	app.use("/test",new testController(testModelInstance).testRouter);
	app.use("/library", new libraryController(libraryModelInstance).router);
	app.use("/follows", new followController(followModelInstance).router);
	app.use("/rate-reviews", new rateReviewController(rateReviewModelInstance).router);
	app.use("/comments", new commentController(commentModelInstance).router);
	app.use("/votes", new voteController(voteModelInstance).router);
	
	
	return app;
}

module.exports = initializeApp;