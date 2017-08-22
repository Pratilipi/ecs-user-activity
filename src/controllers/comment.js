var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wrap = require('co-express');
var commentEntity  = require('./../entities/comment');
var countLookupEntity = require('./../entities/countLookup');
var userEntity        = require('./../entities/user');
var relativeDate = require('relative-date');

var commentModel;
var countLookUpModel = null;
var userUtil = null;

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());


router.post('/', wrap(function * (req, res) {
	console.log("Contorller: Request to add comment");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var commentText   = req.body.comment;
	var date = new Date();
	
	// Construct entity
	var comment = commentEntity.toModel(referenceType, referenceId, userId, commentText, 'ACTIVE');
	
	// Add to database
	var id  = yield commentModel.add(comment)
	.then((data) => {
		console.log("Inserted comment successfully");
		return data.insertId;
	}).catch((error) => {
		console.log("The error is "+error);
		return null;
	});
	
	// If failed to save, return error in response
	if (!id) {
		res.status(500).send(JSON.stringify({'message':'failed to add comment'}));
		return;
	}
	
	// Increment the comment counts
	console.log("inserting into the count lookup "+id);
	var countLookup = countLookupEntity.toModel(referenceType,referenceId,'COMMENT');
	yield countLookUpModel.update(countLookup,'PLUS');
	
	// Get user(who had commented) information 
	var user = yield userUtil.getUserById(userId)
	.then((data) => {
		return userEntity.toDTO(data);
	})
	.catch((err) => {});
	
	if (user == undefined) {
		user = userEntity.toDTO({id:userId});
	} 
	
	// return the new comment in response
	comment = commentEntity.toDTO(id, commentText, referenceType, referenceId, user, 0, true, 'ACTIVE', relativeDate(date), date, date);
	res.status(201).send(JSON.stringify(comment));
	
}));

router.get('/', wrap(function * (req, res) {
	console.log("Contorller: Request to get comments by reference-id");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var comment = null;
	var hasAccessToUpdate = false;
	
	// Get comments by reference id.
	var arr = [];
	var comments = yield commentModel.getByReference(referenceId)
	.then((data) => {
		return data;
		
	}).catch((error) => {
		console.log("The error is "+error);
		return [];
	});
	
	// Iterate through each comments to get additional information
	for (var i in comments) {
		comment = comments[i];
		hasAccessToUpdate = false;
		
		// Set update access
		if (userId == comment.user_id) {
			hasAccessToUpdate = true;
		}
		
		// Get user(who had commented) information 
		var user = yield userUtil.getUserById(comment.user_id)
		.then((data) => {
			return userEntity.toDTO(data);
		})
		.catch((err) => {});
		
		if (user == undefined) {
			user = userEntity.toDTO({id:comment.user_id});
		} 
		
		// Get the like and comment counts
		var likeCount = 0 ; 
		yield countLookUpModel.get(comment.reference_id,'LIKE')
		.then((data) => {
			if (data.length > 0)
				likeCount = data[0].COUNT;
		}).catch((err) => {});
		
		arr.push(commentEntity.toDTO(comment.id, comment.comment, comment.referenceType, comment.referenceId, user, likeCount, hasAccessToUpdate, comment.state, relativeDate(comment.date_created), comment.date_created, comment.date_updated));
	}
	
    //TODO: Handle pagination attributes.
	
	// Send response.
	res.status(200).send(JSON.stringify({"data":arr,"cursor":"80n09ct023y70283ytpun2cnr8023ry","resultCount":5,"numberFound":34}));
}));

router.get('/:id', wrap(function * (req, res) {
	console.log("Controller: Request to get comments by id");
	
	// Read Parameters
	var userId        = req.customParams.userId;
	var commentId  = req.params.id;
	
	var hasAccessToUpdate = false;
	
	// Get comment by id
	var comment = yield commentModel.get(commentId)
	.then((data) => {
		return data[0];
	}).catch((error) => {});
	
	// Return 404 in response, if not found.
	if (comment == undefined || comment == null) {
		res.status(404).send(JSON.stringify({'message':'Comment not found for given id'}));
		return;
	}
	
	// Set update access
	if (userId == comment.user_id) {
		hasAccessToUpdate = true;
	}
	
	// Get user(who had commented) information
	var user = yield userUtil.getUserById(comment.user_id)
	.then((data) => {
		return userEntity.toDTO(data);
	})
	.catch((err) => {});
	
	if (user == undefined) {
		user = userEntity.toDTO({id:comment.user_id});
	} 
	
	// Get the likes count
	var likeCount = 0 ; 
	yield countLookUpModel.get(comment.reference_id,'LIKE')
	.then((data) => {
		if (data.length > 0)
			likeCount = data[0].COUNT;
	}).catch((err) => {});
	
	
	// Return response
	comment = commentEntity.toDTO(comment.id, comment.comment, comment.reference_type, comment.reference_id, user, likeCount, hasAccessToUpdate, comment.state, relativeDate(comment.date_created), comment.date_created, comment.date_updated);
	res.status(200).send(JSON.stringify(comment));
	
}));

router.patch("/:id", wrap(function * (req, res) {
	console.log("Controller: Request to update comment by id");
	
	// Read Parameters
	var commentId     = req.params.id;
	var comment       = req.body.comment;
	var state         = req.body.state;
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	
	// Construct map with modified fields 
	var map = {};
	if (comment != null) {
		map['comment'] = comment; 
	}
	
	if (state != null) {
		map['state'] = state;
	}
	
	// Update the database
	var isUpdated = yield commentModel.update(map,commentId)
	.then((data) => {
		// Update comment count, If there is state change update of type 'Delete' or 'Block'
		if (state == 'BLOCKED' || state == 'DELETED') {
			var countLookup = countLookupEntity.toModel(referenceType,referenceId,'COMMENT');
			countLookUpModel.update(countLookup,'MINUS');
		}
		return data;
	}).catch((error) => {
		return false;
	});
	
	// Send 404 in response, if update is failed.
	if (!isUpdated) {
		res.status(404).send(JSON.stringify({'message':'Comment not found to update'}));
	}
	
	// Send response
	res.status(200).send(JSON.stringify({'message':'Successfully updated Comment'}));
	
}));

router.delete("/:id", wrap(function * (req, res) {
	console.log("Controller: Request to delete comment by id");
	
	// Read Parameters
	var userId        = req.customParams.userId;
	var commentId     = req.params.id;
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	
	// Delete(soft) from database.
	var isDeleted = yield commentModel.delete(commentId)
	.then((data) => {
		return data;
	}).catch((error) => {
		return false;
	});
	
	// Send 404 in response, if failed to delete.
	if (!isDeleted) {
		res.status(404).send(JSON.stringify({'message':'Comment not found to delete'}));
	}
	
	// Update comment counts in database
	var countLookup = countLookupEntity.toModel(referenceType,referenceId,'COMMENT');
	countLookUpModel.update(countLookup,'MINUS');	

	// Send response
	res.status(200).send(JSON.stringify({'message':'Successfully deleted Comment'}));
}));	


function Comment (commentModelInst, countLookUpModelInst, userUtilInst) {
	commentModel = commentModelInst;
	countLookUpModel = countLookUpModelInst;
	userUtil = userUtilInst;
}

Comment.prototype.router = router;

module.exports = Comment;