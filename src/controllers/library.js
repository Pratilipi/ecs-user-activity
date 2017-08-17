var express = require('express');
var router = express.Router();

// library route
router.get('/isAdded', function (req, res) {
	
	var userId = req.query.userId;
	var pratilipiIds = req.query.pratilipiId;
	
	if (pratilipiIds != null) {
		pratilipiIds = pratilipiIds.split(',').map(Number);
	}
	
	var ids = [];
	for (var i=0; i < pratilipiIds.length; i++) {
		ids[i] = userId+"-"+pratilipiIds[i];
	}
	
	var resultPromise = libraryModel.list(ids);
	
	resultPromise.then(function(data) {
		var result = [];
		for (var i=0; i < data.length; i++) {
			result[i] = new isAddedResponse(data[i].ADDED_TO_LIB,data[i].PRATILIPI_ID);
		}
		res.setHeader('content-type', 'application/json');
		res.status(200).send(JSON.stringify(new isAddedResponseWrapper(userId,result)));
	}).catch( ( err ) => {
 		res.status(404).send("error");
 	});
	
});


router.post('/', function (req, res) {
	console.log("inserting ..!!!");
	libraryModel.insert();
});


function isAddedResponse (addedToLib, pratilipiId) {
	this.addedToLib = addedToLib;
	this.pratilipiId = pratilipiId;
}

function isAddedResponseWrapper(userId,data) {
	this.userId = userId;
	this.data = data;
}

var libraryModel;
function Library (libraryModelInst) {
	libraryModel = libraryModelInst;
}

Library.prototype.router = router;

module.exports = Library;