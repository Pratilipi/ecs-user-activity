var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wrap = require('co-express');
var followEntity  = require('./../entities/follow');
var countLookupEntity = require('./../entities/countLookup');
var userEntity        = require('./../entities/user');
var authorEntity        = require('./../entities/author');
var relativeDate = require('relative-date');

var followModel = null;
var countLookUpModel = null;
var userUtil = null;
var authorUtil = null;

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.post('/', wrap(function * (req, res) {
	console.log("Contorller: Request to add follow");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var state		  = req.body.state;
	var date = new Date();
	
	// Construct entity
	var follow = followEntity.toModel(referenceType, referenceId, userId, state);
	
	// Add to database
	var affectedRows  = yield followModel.add(follow)
	.then((data) => {
		console.log("Inserted/udpated follow successfully");
		return data.affectedRows;
	}).catch((error) => {
		console.log("The error is "+error);
		return 0;
	});
	
	// If failed to save, return error in response
	if (affectedRows == 0) {
		res.status(500).send(JSON.stringify({'message':'failed to add follow'}));
		return;
	}
	
	// Update the follow counts
	console.log("updating the count lookup ");
	if (affectedRows == 1 && state == "FOLLOWING") {
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,'FOLLOW');
		yield countLookUpModel.update(countLookup,'PLUS');
	} else if (affectedRows == 2 && state == "UNFOLLOWED") {
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,'FOLLOW');
		yield countLookUpModel.update(countLookup,'MINUS');
	}
	
	// Sending the response
	res.status(201).send(JSON.stringify({"message": "success"}));
	
}));


router.get('/followers', wrap(function * (req, res) {
	console.log("Contorller: Request to get followers by reference-id");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var arr = [];
	var follow;
	var hasAccessToUpdate = false;
	
	// Get follows by reference	
	var follows = yield followModel.getByReference(referenceId)
	.then((data) => {
		return data;
	}).catch((error) => {
		console.log("The error is "+error);
		return [];
	});
	
	// Iterate through each follow to get additional information
	for (var i in follows) {
		follow = follows[i];
		hasAccessToUpdate = false;
		
		// Set update access
		if (userId == follow.user_id) {
			hasAccessToUpdate = true;
		}
		
		// Get User details
		var user = yield userUtil.getUserById(follow.user_id)
		.then((data) => {
			return userEntity.toDTO(data);
		})
		.catch((err) => {});
		
		if (user == undefined) {
			user = userEntity.toDTO({id:follow.user_id});
		} 
			
		arr.push(followEntity.toDTO(follow.id, follow.reference_type, follow.reference_id, user, null, hasAccessToUpdate, follow.state, relativeDate(follow.date_created), follow.date_created, follow.date_updated));		
	}
	
	// Send response.
	res.status(200).send(JSON.stringify({"data":arr,"cursor":"80n09ct023y70283ytpun2cnr8023ry","resultCount":5,"numberFound":34}));
}));


router.get('/following', wrap(function * (req, res) {
	console.log("Contorller: Request to get following by user-id");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var arr = [];
	var follow;
	var hasAccessToUpdate = false;

	// Get follows by user	
	var follows = yield followModel.getByUser(referenceId)
	.then((data) => {
		return data;
	}).catch((error) => {
		console.log("The error is "+error);
		return [];
	});
	
	// Iterate through each follow to get additional information
	for (var i in follows) {
		follow = follows[i];
		hasAccessToUpdate = false;
		
		// Set update access
		if (referenceId == follow.reference_id) {
			hasAccessToUpdate = true;
		}
		
		
		// Get Author details
		var	author = yield authorUtil.getAuthorById(follow.reference_id)
		.then((data) => {
			return authorEntity.toDTO(data);
		})
		.catch((err) => {});
			
		if (author == undefined) {
			author = authorEntity.toDTO({id:follow.reference_id});
		} 
		
		arr.push(followEntity.toDTO(follow.id, follow.reference_type, follow.reference_id, null, author, hasAccessToUpdate, follow.state, relativeDate(follow.date_created), follow.date_created, follow.date_updated));
		
	}
	
	// Send response.
	res.status(200).send(JSON.stringify({"data":arr,"cursor":"80n09ct023y70283ytpun2cnr8023ry","resultCount":5,"numberFound":34}));
}));


router.get('/isFollowing', wrap(function * (req, res) {
	// Read Parameters
	var referenceType = req.query.referenceType;
	var referenceIds   = req.query.referenceId;
	var userId        = req.query.userId;
	var arr = [];
	var isFollowing = false;
	// is following response object
	function isFollowingResponse (following, referenceId, referenceType) {
		this.following = following;
		this.referenceId = referenceId;
		this.referenceType = referenceType;
	}

	// Split if there are multiple ids sent
	if (referenceIds != null) {
		referenceIds = referenceIds.split(',').map(Number);
	}
	
	
	for (var i=0; i < referenceIds.length; i++) {

		// Get follow by reference and user
		yield followModel.getByRefernceAndUser(referenceIds[i],userId)
		.then((data) => {
			
			isFollowing = false;
			if (data[0].state == "FOLLOWING") {
				isFollowing = true;
			} 
			
			arr.push(new isFollowingResponse(isFollowing,data[0].reference_id,data[0].reference_type));
			
		}).catch((error) => {
			console.log("The error is "+error);
			return [];
		});
		
	}
	
	// Send response.
	res.status(200).send(JSON.stringify({"userId":userId,"data":arr}));
	
}));


function Follow (followModelInst, countLookUpModelInst, userUtilInst, authorUtilInst) {
	followModel = followModelInst;
	countLookUpModel = countLookUpModelInst;
	userUtil = userUtilInst;
	authorUtil = authorUtilInst;
}

Follow.prototype.router = router;

module.exports = Follow;