var User = require('./user');

function Comment() {
	this.id = null;
	this.comment       = null;
	this.referenceType = null;
	this.referenceId   = null;
	this.userId        = null;
	this.user          = new User();
	this.likesCount    = null;
	this.state         = null;
	this.hasAccessToUpdate = null;
	this.relativeTime  = null;
	this.dateCreated   = null;
	this.dateUpdated   = null;
}

Comment.toModel = function (refType, refId, userId, commentText, state) {
	var comment = new Comment();

	comment.referenceType = refType;
	comment.referenceId   = refId;
	comment.userId        = userId;
	comment.comment       = commentText;
	comment.state         = state;
	return comment;
}

Comment.toDTO = function (id, commentText, refType, refId, user, likesCount, hasAccessToUpdate, state, relativeTime, dateCreated, dateUpdated) {
	var comment = new Comment();

	comment.id            = id;
	comment.comment       = commentText;
	comment.referenceType = refType;
	comment.referenceId   = refId;
	comment.user          = user;
	comment.likesCount    = likesCount;
	comment.hasAccessToUpdate = hasAccessToUpdate;
	comment.state         = state;
	comment.relativeTime  = relativeTime;
	comment.dateCreated   = dateCreated;
	comment.dateUpdated   = dateUpdated;
	return comment;
}


Comment.toResponse = function (model, user) {
	var comment = new Comment();
	
	return comment;
}

module.exports = Comment;