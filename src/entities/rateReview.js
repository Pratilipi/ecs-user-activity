var User = require('./user');

function RateReview() {
	this.id = null;
	this.rating        = null;
	this.review        = null;
	this.referenceType = null;
	this.referenceId   = null;
	this.userId        = null;
	this.user          = new User();
	this.likesCount    = null;
	this.commentsCount = null;
	this.hasAccessToUpdate = null;
	this.state         = null;
	this.relativeTime  = null;
	this.dateCreated   = null;
	this.dateUpdated   = null;
}

RateReview.toModel = function (refType, refId, userId, rating, review, state) {
	var rateReview = new RateReview();

	rateReview.referenceType = refType;
	rateReview.referenceId   = refId;
	rateReview.userId        = userId;
	rateReview.rating        = rating;
	rateReview.review        = review;
	rateReview.state         = state;
	return rateReview;
}

RateReview.toDTO = function (id, rating, review, refType, refId, user, likesCount, commentsCount, hasAccessToUpdate, state, relativeTime, dateCreated, dateUpdated) {
	var rateReview = new RateReview();

	rateReview.id            = id;
	rateReview.rating        = rating;
	rateReview.review        = review;
	rateReview.referenceType = refType;
	rateReview.referenceId   = refId;
	rateReview.user          = user;
	rateReview.likesCount    = likesCount;
	rateReview.commentsCount = commentsCount;
	rateReview.hasAccessToUpdate = hasAccessToUpdate;
	rateReview.state         = state;
	rateReview.relativeTime  = relativeTime;
	rateReview.dateCreated   = dateCreated;
	rateReview.dateUpdated   = dateUpdated;
	return rateReview;
}


RateReview.toResponse = function (model, user) {
	var rateReview = new RateReview();
	
	return rateReview;
}


module.exports = RateReview;