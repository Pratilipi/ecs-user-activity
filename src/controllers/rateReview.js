var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var wrap = require('co-express');
var rateReviewEntity  = require('./../entities/rateReview');
var countLookupEntity = require('./../entities/countLookup');
var userEntity        = require('./../entities/user');
var relativeDate = require('relative-date');

var rateReviewModel = null;
var countLookUpModel = null;
var userUtil = null;

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.post('/', wrap(function * (req, res) {
	console.log("Contorller: Request to add rate-review");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var rating        = req.body.rating;
	var review        = req.body.review;
	var date = new Date();
	
	// Construct entity
	var rateReview = rateReviewEntity.toModel(referenceType, referenceId, userId, rating, review, 'PUBLISHED');
	
	// Add to database
	var id  = yield rateReviewModel.add(rateReview)
	.then((data) => {
		console.log("Inserted rate-review successfully");
		return data.insertId;
	}).catch((error) => {
		console.log("The error is "+error);
		return null;
	});
	
	// If failed to save, return error in response
	if (!id) {
		res.status(500).send(JSON.stringify({'message':'failed to add rating and review'}));
		return;
	}
	
	// Increment the rate and review counts
	console.log("inserting into the count lookup "+id);
	var countLookup = countLookupEntity.toModel(referenceType,referenceId,'RATE');
	yield countLookUpModel.update(countLookup,'PLUS');
	if (!review) {
		countLookup = countLookupEntity.toModel(referenceType,referenceId,'REVIEW');
		yield countLookUpModel.update(countLookup,'PLUS');
	}
	
	// Get user(who had reviewed) information 
	var user = yield userUtil.getUserById(userId)
	.then((data) => {
		return userEntity.toDTO(data);
	})
	.catch((err) => {});
	
	if (user == undefined) {
		user = userEntity.toDTO({id:userId});
	} 
	
	// return the new rate-review in response
	rateReview = rateReviewEntity.toDTO(id, rating, review, referenceType, referenceId, user, 0, 0, true, 'PUBLISHED', relativeDate(date), date, date);
	res.status(201).send(JSON.stringify(rateReview));
	
}));


/*
router.post('/', function (req, res) {
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var rating        = req.body.rating;
	var review        = req.body.review;
	var id            = null;
	
	console.log("Request reached to controller");
	
	// Construct entity
	var rateReview = rateReviewEntity.toModel(referenceType, referenceId, userId, rating, review, 'PUBLISHED');
	
	// Add to database
	console.log("Inserting a new rate-review to database");
	var rateReviewPromise = rateReviewModel.add(rateReview)
	
	rateReviewPromise.then((data) => {
		console.log("Inserted rate-review");
		id = data.insertId;
		
		console.log("inserting into the count lookup");
		var countLookup = countLookupEntity.toModel(referenceType,referenceId,'RATE');
		countLookUpModel.update(countLookup);
		
		res.status(201).send(JSON.stringify({'message':'success'}));
		
	}).catch((error) => {
		console.log("The error is "+error);
		res.status(500).send(JSON.stringify({'message':'fail'}));
		
	});
	
	
	
	
	// Construct response
	//var model = "";
	//var user = "";
	//var response = rateReviewEntity.toResponse(model, user);
	
	// return response
	//res.status(201).send(JSON.stringify(response));
	
	
});
*/

router.get('/', wrap(function * (req, res) {
	console.log("Contorller: Request to get rate-review by reference-id");
	
	// Read Parameters
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	var userId        = req.customParams.userId;
	var rateReview = null;
	var hasAccessToUpdate = false;
	
	// Get rate-reviews by reference id.
	var arr = [];
	var rateReviews = yield rateReviewModel.getByReference(referenceId)
	.then((data) => {
		return data;
		
	}).catch((error) => {
		console.log("The error is "+error);
		return [];
	});
	
	// Iterate through each rate-review to get additional information
	for (var i in rateReviews) {
		rateReview = rateReviews[i];
		hasAccessToUpdate = false;
		
		// Set update access
		if (userId == rateReview.user_id) {
			hasAccessToUpdate = true;
		}
		
		// Get user(who had reviewed) information 
		var user = yield userUtil.getUserById(rateReview.user_id)
		.then((data) => {
			return userEntity.toDTO(data);
		})
		.catch((err) => {});
		
		if (user == undefined) {
			user = userEntity.toDTO({id:rateReview.user_id});
		} 
		
		// Get the like and comment counts
		var likeCount = 0 ; 
		var commentCount = 0;
		yield countLookUpModel.get(rateReview.reference_id,'LIKE')
		.then((data) => {
			if (data.length > 0)
				likeCount = data[0].COUNT;
		}).catch((err) => {});
		yield countLookUpModel.get(rateReview.reference_id,'COMMENT')
		.then((data) => {
			if (data.length > 0)
				commentCount = data[0].COUNT;
		}).catch((err) => {});
		
		arr.push(rateReviewEntity.toDTO(rateReview.id, rateReview.rating, rateReview.review, rateReview.reference_type, rateReview.reference_id, user, likeCount, commentCount, hasAccessToUpdate, rateReview.state, relativeDate(rateReview.date_created), rateReview.date_created, rateReview.date_updated));
	}
	
	//TODO: Handle pagination attributes.
	
	// Send response.
	res.status(200).send(JSON.stringify({"data":arr,"cursor":"80n09ct023y70283ytpun2cnr8023ry","resultCount":5,"numberFound":34}));
}));

router.get('/:id', wrap(function * (req, res) {
	console.log("Controller: Request to get rate-review by id");
	
	// Read Parameters
	var userId        = req.customParams.userId;
	var rateReviewId  = req.params.id;
	
	var hasAccessToUpdate = false;
	
	// Get rate-review by id
	var rateReview = yield rateReviewModel.get(rateReviewId)
	.then((data) => {
		return data[0];
	}).catch((error) => {});
	
	// Return 404 in response, if not found.
	if (rateReview == undefined || rateReview == null) {
		res.status(404).send(JSON.stringify({'message':'Rate-Review not found for given id'}));
		return;
	}
	
	// Set update access
	if (userId == rateReview.user_id) {
		hasAccessToUpdate = true;
	}
	
	// Get user(who had reviewed) information
	var user = yield userUtil.getUserById(rateReview.user_id)
	.then((data) => {
		return userEntity.toDTO(data);
	})
	.catch((err) => {});
	
	if (user == undefined) {
		user = userEntity.toDTO({id:rateReview.user_id});
	} 
	
	// Get the likes and comments count
	var likeCount = 0 ; 
	yield countLookUpModel.get(rateReview.reference_id,'LIKE')
	.then((data) => {
		if (data.length > 0)
			likeCount = data[0].COUNT;
	}).catch((err) => {});

	var commentCount = 0;
	yield countLookUpModel.get(rateReview.reference_id,'COMMENT')
	.then((data) => {
		if (data.length > 0)
			commentCount = data[0].COUNT;
	}).catch((err) => {});
	
	
	// Return response
	rateReview = rateReviewEntity.toDTO(rateReview.id, rateReview.rating, rateReview.review, rateReview.reference_type, rateReview.reference_id, user, likeCount, commentCount, hasAccessToUpdate, rateReview.state, relativeDate(rateReview.date_created), rateReview.date_created, rateReview.date_updated);
	res.status(200).send(JSON.stringify(rateReview));
	
}));

router.patch("/:id", wrap(function * (req, res) {
	console.log("Controller: Request to update rate-review by id");

	// Read Parameters
	var rateReviewId  = req.params.id;
	var rating        = req.body.rating;
	var review        = req.body.review;
	var state         = req.body.state;
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	
	// Construct map with modified fields 
	var map = {};
	if (rating != null) {
		map['rating'] = rating; 
	}
	
	if (review != null) {
		map['review'] = review;
	}
	
	if (state != null) {
		map['state'] = state;
	}
	
	// Update the database
	var isUpdated = yield rateReviewModel.update(map,rateReviewId)
	.then((data) => {
		// Update rate and review count, If there is state change update of type 'Delete' or 'Block'
		if (state == 'BLOCKED' || state == 'DELETED') {
			var countLookup = countLookupEntity.toModel(referenceType,referenceId,'RATE');
			countLookUpModel.update(countLookup,'MINUS');
			countLookup = countLookupEntity.toModel(referenceType,referenceId,'REVIEW');
			countLookUpModel.update(countLookup,'MINUS');
			
		}
		return data;
	}).catch((error) => {
		return false;
	});
	
	// Send 404 in response, if update is failed.
	if (!isUpdated) {
		res.status(404).send(JSON.stringify({'message':'Rate-Review not found to update'}));
	}
	
	// Send response
	res.status(200).send(JSON.stringify({'message':'Successfully updated Rate-Review'}));
	
}));

router.delete("/:id", wrap(function * (req, res) {
	console.log("Controller: Request to delete rate-review by id");

	// Read Parameters
	var userId        = req.customParams.userId;
	var rateReviewId  = req.params.id;
	var referenceType = req.customParams.referenceType;
	var referenceId   = req.customParams.referenceId;
	
	// Delete(soft) from database.
	var isDeleted = yield rateReviewModel.delete(rateReviewId)
	.then((data) => {
		return data;
	}).catch((error) => {
		return false;
	});
	
	// Send 404 in response, if failed to delete.
	if (!isDeleted) {
		res.status(404).send(JSON.stringify({'message':'Rate-Review not found to delete'}));
	}
	
	// Update rate and review counts in database
	var countLookup = countLookupEntity.toModel(referenceType,referenceId,'RATE');
	countLookUpModel.update(countLookup,'MINUS');	
	countLookup = countLookupEntity.toModel(referenceType,referenceId,'REVIEW');
	countLookUpModel.update(countLookup,'MINUS');
	
	// Send response
	res.status(200).send(JSON.stringify({'message':'Successfully deleted Rate-Review'}));
	
}));


function RateReview (rateReviewModelInst, countLookUpModelInst, userUtilInst) {
	rateReviewModel = rateReviewModelInst;
	countLookUpModel = countLookUpModelInst;
	userUtil = userUtilInst;
}

RateReview.prototype.router = router;

module.exports = RateReview;