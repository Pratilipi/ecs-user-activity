var User = require('./user');

function Vote() {
	this.id = null;
	this.type = null;
	this.referenceType = null;
	this.referenceId   = null;
	this.userId        = null;
	this.user          = new User();
	this.hasAccessToUpdate = null;
	this.relativeTime  = null;
	this.dateCreated   = null;
	this.dateUpdated   = null;
}

Vote.toModel = function (type, refType, refId, userId) {
	var vote = new Vote();

	vote.type          = type;
	vote.referenceType = refType;
	vote.referenceId   = refId;
	vote.userId        = userId;
	return vote;
}

Vote.toDTO = function (id, type, refType, refId, user, hasAccessToUpdate, relativeTime, dateCreated, dateUpdated) {
	var vote = new Vote();

	vote.id            = id;
	vote.type       = type;
	vote.referenceType = refType;
	vote.referenceId   = refId;
	vote.user          = user;
	vote.hasAccessToUpdate = hasAccessToUpdate;
	vote.relativeTime  = relativeTime;
	vote.dateCreated   = dateCreated;
	vote.dateUpdated   = dateUpdated;
	return vote;
}

Vote.toResponse = function (model, user) {
	var vote = new Vote();
	
	return vote;
}

module.exports = Vote;