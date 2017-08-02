// Imports
var express     = require('express');
var testModel	= require('./models/testModel');
var testController  = require('./controllers/testController');
var app = null;

function initializeApp(mysql) {
	
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
	
	
	console.log("Initializing routes...");
	// Initialize routes
	testController.setTestModel(testModelInstance);
	app.use("/test",testController.testRouter);
	
	return app;
}

module.exports = initializeApp;