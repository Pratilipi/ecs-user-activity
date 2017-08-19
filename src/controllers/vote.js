var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wrap = require('co-express');
var voteEntity  = require('./../entities/vote');
var countLookupEntity = require('./../entities/countLookup');
var userEntity        = require('./../entities/user');
var relativeDate = require('relative-date');

var voteModel = null;
var countLookUpModel = null;
var userUtil = null;

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());


router.post('/', wrap(function * (req, res) {
	console.log("Contorller: Request to add vote");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var type          = req.body.type;
	var date = new Date();
	
	// Get the previous vote if exists.
	var previousVote = yield voteModel.getByReferenceIdAndUserId(referenceId,userId)
	.then((data) => {
		if (data.length > 0) {
			return data[0];
		}
		return null;
	}).catch((error) => {
		res.status(500).send(JSON.stringify({'message':'Internal server error'}));
		return;
	});
	
	// Throw error, if there is no previous vote and requested with type 'NONE'
	if (previousVote == null && type == "NONE") {
			res.status(400).send(JSON.stringify({'message':'Invalid request'}));
			return;
	}
	
	// Construct entity
	var vote = voteEntity.toModel(type, referenceType, referenceId, userId);
	
	// Add to database
	var affectedRows  = yield voteModel.add(vote)
	.then((data) => {
		console.log("Inserted vote successfully");
		return data.affectedRows;
	}).catch((error) => {
		console.log("The error is "+error);
		return null;
	});
	
	if (previousVote != null) {
	// Decrement the count for the previous vote type
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,previousVote.type);
		countLookUpModel.update(countLookup,'MINUS');
	}
	
	if (type != "NONE") {
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,type);
		countLookUpModel.update(countLookup,'PLUS');
	}
	
	res.status(201).send(JSON.stringify({"message": "success"}));
}));	


router.get('/', wrap(function * (req, res) {
	console.log("Contorller: Request to get votes by reference-id");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var type          = req.query.type;
	var vote = null;
	var hasAccessToUpdate = false;
	
	// Get votes by reference id.
	var arr = [];
	var votes = yield voteModel.getByReference(referenceId, type)
	.then((data) => {
		return data;
		
	}).catch((error) => {
		console.log("The error is "+error);
		return [];
	});
	
	// Iterate through each vote to get additional information
	for (var i in votes) {
		vote = votes[i];
		hasAccessToUpdate = false;
		
		// Set update access
		if (userId == vote.user_id) {
			hasAccessToUpdate = true;
		}
		
		// Get user(who had reviewed) information 
		var user = yield userUtil.getUserById(vote.user_id)
		.then((data) => {
			return userEntity.toDTO(data);
		})
		.catch((err) => {});
		
		if (user == undefined) {
			user = userEntity.toDTO({id:vote.user_id});
		} 
		
		arr.push(voteEntity.toDTO(vote.id, vote.type, vote.reference_type, vote.reference_id, user, hasAccessToUpdate, relativeDate(vote.date_created), vote.date_created, vote.date_updated));
	}
	
	// Send response.
	res.status(200).send(JSON.stringify({"data":arr,"cursor":"80n09ct023y70283ytpun2cnr8023ry","resultCount":5,"numberFound":34}));
}));	

/*
router.patch("/:id", wrap(function * (req, res) {
	console.log("Controller: Request to update vote by id");
	
	// Read Parameters
	var voteId        = req.params.id;
	var type          = req.body.type;
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	
	// Construct map with modified fields 
	var map = {};
	if (type != null) {
		map['type'] = type; 
	}
	
	// Get the current vote by user
	var previousVotes = yield voteModel.get(voteId);
	
	// Update the database
	var isUpdated = yield voteModel.update(map,voteId)
	.then((data) => {
		return data;
	}).catch((error) => {
		return false;
	});
	
	
	// Send 404 in response, if update is failed.
	if (!isUpdated) {
		res.status(404).send(JSON.stringify({'message':'Vote not found to update'}));
		return;
	}
	
	
	console.log(isUpdated);
	
	// If previous vote exists
	if (previousVotes.length > 0) {
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,previousVotes[0].type);
		
		console.log(countLookup);
		countLookUpModel.update(countLookup,'MINUS');
	}
	
	// If type change is not to 'NONE' then increment vote count
	if (type != "NONE") {
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,type);
		console.log(countLookup);
		countLookUpModel.update(countLookup,'PLUS');
	}
	
	// Send response
	res.status(200).send(JSON.stringify({'message':'Successfully updated Vote'}));
	
}));	
*/

function Vote (voteModelInst, countLookUpModelInst, userUtilInst) {
	voteModel = voteModelInst;
	countLookUpModel = countLookUpModelInst;
	userUtil = userUtilInst;
}

Vote.prototype.router = router;

module.exports = Vote;