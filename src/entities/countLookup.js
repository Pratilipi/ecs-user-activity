function CountLookup() {
	this.referenceType = null;
	this.referenceId   = null;
	this.countType     = null;
	this.count         = null;
}

CountLookup.toModel = function (referenceType, referenceId, countType) {
	var countLookup = new CountLookup();

	countLookup.referenceType = referenceType;
	countLookup.referenceId   = referenceId;
	countLookup.countType     = countType;
	
	return countLookup;
}

CountLookup.toResponse = function (model, user) {
	var countLookup = new CountLookup();
	
	return countLookup;
}


module.exports = CountLookup;