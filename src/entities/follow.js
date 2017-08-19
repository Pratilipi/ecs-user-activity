var User = require('./user');
var Author = require('./Author');

function Follow() {
	this. id = null;
	this.referenceType = null;
	this.referenceId   = null;
	this.userId        = null;
	this.user          = new User();
	this.authorId      = null;
	this.author        = new Author();
	this.hasAccessToUpdate = null;
	this.state         = null;
	this.relativeTime  = null;
	this.dateCreated   = null;
	this.dateUpdated   = null;
	
}


Follow.toModel = function (refType, refId, userId, state) {
	var follow = new Follow();

	follow.referenceType = refType;
	follow.referenceId   = refId;
	follow.userId        = userId;
	follow.state         = state;
	return follow;
}

Follow.toDTO = function (id, refType, refId, user, author, hasAccessToUpdate, state, relativeTime, dateCreated, dateUpdated) {
	var follow = new Follow();

	follow.id            = id;
	follow.referenceType = refType;
	follow.referenceId   = refId;
	follow.user          = user;
	follow.author            = author;
	follow.hasAccessToUpdate = hasAccessToUpdate;
	follow.state         = state;
	follow.relativeTime  = relativeTime;
	follow.dateCreated   = dateCreated;
	follow.dateUpdated   = dateUpdated;
	return follow;
}


Follow.toResponse = function (model, user) {
	var follow = new Follow();
	
	return follow;
}


module.exports = Follow;