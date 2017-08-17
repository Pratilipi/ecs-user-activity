
function User() {
	this.id = null;
	this.fullName = null;
	this.fullNameEn = null;
	this.displayName = null;
	this.profileImageUrl = null;
}


User.toDTO = function (obj) {
	var user = new User();
	
	user.id = obj.id;
	user.fullName = obj.fullName;
	user.fullNameEn = obj.fullNameEn;
	user.displayName = obj.displayName;
	user.profileImageUrl = obj.profileImageUrl;
	
	return user;
}


module.exports = User;
