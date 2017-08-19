// Imports
var express      = require('express');
var wrap = require('co-express');
var logger = require('morgan');
var testModel	 = require('./models/test');
var libraryModel = require('./models/library');
var followModel  = require('./models/follow');
var rateReviewModel = require('./models/rateReview');
var commentModel = require('./models/comment');
var voteModel = require('./models/vote');
var countLookupModel = require('./models/countLookup');
var testController    = require('./controllers/test');
var libraryController = require('./controllers/library');
var followController  = require('./controllers/follow');
var rateReviewController = require('./controllers/rateReview');
var commentController = require('./controllers/comment');
var voteController = require('./controllers/vote');
var userUtil = require('./utils/user');
var authorUtil = require('./utils/author');

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
	
	// Initialize user util
	var userUtilInstance = new userUtil();
	var authorUtilInstance = new authorUtil();
	
	// Initialize models
	console.log("Initializing models...");
	var testModelInstance        = new testModel(mysql);
	var libraryModelInstance     = new libraryModel( { projectId: process.env.GCP_PROJ_ID || config.GCP_PROJ_ID} );
	var rateReviewModelInstance  = new rateReviewModel(mysql);
	var commentModelInstance     = new commentModel(mysql);
	var voteModelInstance        = new voteModel(mysql);
	var countLookupModelInstance = new countLookupModel(mysql);
	var followModelInstance      = new followModel(mysql);
	
	// Get User-Id from header
	app.use("/", wrap(function * (req, res, next) {
		var uid = req.headers['user-id'];
		req.customParams = {};
		req.customParams.userId = uid;
		next();
	}));
	
	// Setting response header to json
	app.use("/", function (req, res, next) {
		res.setHeader('content-type', 'json/application');
		next();
	});
	
	
	// Handle references
	app.use(["/:referenceType/:referenceId/rate-reviews","/:referenceType/:referenceId/comments","/:referenceType/:referenceId/votes","/:referenceType/:referenceId/follows"], function (req,res,next) {
		req.customParams.referenceType = req.params.referenceType;
		req.customParams.referenceId = req.params.referenceId;
		next();
	});
	
	
	// Initialize controllers
	console.log("Initializing routes...");
	app.use("/test",new testController(testModelInstance).testRouter);
	app.use("/library", new libraryController(libraryModelInstance).router);
	app.use("/:referenceType/:referenceId/rate-reviews", new rateReviewController(rateReviewModelInstance, countLookupModelInstance, userUtilInstance).router);
	app.use("/:referenceType/:referenceId/comments", new commentController(commentModelInstance, countLookupModelInstance, userUtilInstance).router);
	app.use("/:referenceType/:referenceId/votes", new voteController(voteModelInstance, countLookupModelInstance, userUtilInstance).router);
	app.use(["/:referenceType/:referenceId/follows","/follows"], new followController(followModelInstance, countLookupModelInstance, userUtilInstance, authorUtilInstance).router);
	
	
	return app;
}

module.exports = initializeApp;