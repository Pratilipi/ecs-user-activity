var User = require('./user');

function Review() {
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

Review.toModel = function (refType, refId, userId, rating, _review, state) {
	var review = new Review();

	review.referenceType = refType;
	review.referenceId   = refId;
	review.userId        = userId;
	review.rating        = rating;
	review.review        = _review;
	review.state         = state;
	return review;
}

Review.toDTO = function (id, rating, _review, refType, refId, user, likesCount, commentsCount, hasAccessToUpdate, state, relativeTime, dateCreated, dateUpdated) {
	var review = new Review();

	review.id            = id;
	review.rating        = rating;
	review.review        = _review;
	review.referenceType = refType;
	review.referenceId   = refId;
	review.user          = user;
	review.likesCount    = likesCount;
	review.commentsCount = commentsCount;
	review.hasAccessToUpdate = hasAccessToUpdate;
	review.state         = state;
	review.relativeTime  = relativeTime;
	review.dateCreated   = dateCreated;
	review.dateUpdated   = dateUpdated;
	return review;
}


Review.toResponse = function (model, user) {
	var review = new Review();
	
	return review;
}


module.exports = Review;