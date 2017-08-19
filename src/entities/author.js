function Author() {
	this.id = null;
	this.name = null;
	this.fullNameEn = null;
	this.displayName = null;
	this.profileImageUrl = null;
	this.pageUrl = null;
}


Author.toDTO = function (obj) {
	var author = new Author();
	
	author.id = obj.id;
	author.name = obj.fullName;
	author.fullNameEn = obj.fullNameEn;
	author.displayName = obj.displayName;
	author.profileImageUrl = obj.profileImageUrl;
	author.pageUrl = obj.pageUrl;
	
	return author;
}


module.exports = Author;