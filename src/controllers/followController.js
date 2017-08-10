var express = require('express');
var router = express.Router();

// Injecting testModel
//function setFollowModel(model) {
//	followModel = model;
//}

// follow route
router.get('/isFollowing', function (req, res) {
	
	var userId = req.query.userId;
	var referenceType = req.query.referenceType;
	var referenceIds = req.query.referenceId;
	
	if (referenceIds != null) {
		referenceIds = referenceIds.split(',').map(Number);
	}
	
	var ids = [];
	for (var i=0; i < referenceIds.length; i++) {
		ids[i] = userId+"-"+referenceIds[i];
	}
	
	var resultPromise = followModel.list(ids);
	
	resultPromise.then(function(data) {
		var result = [];
		for (var i=0; i < data.length; i++) {
			result[i] = new isFollowingResponse(data[i].FOLLOWING,data[i].AUTHOR_ID,referenceType);
		}
		res.setHeader('content-type', 'application/json');
		res.status(200).send(JSON.stringify(new isFollowingResponseWrapper(userId,result)));
	}).catch( ( err ) => {
 		res.status(404).send("error");
 	});
	
});


router.post('/', function (req, res) {
	console.log("inserting ..!!!");
	followModel.insert();
});


function isFollowingResponse (following, referenceId, referenceType) {
	this.following = following;
	this.referenceId = referenceId;
	this.referenceType = referenceType;
}

function isFollowingResponseWrapper(userId,data) {
	this.userId = userId;
	this.data = data;
}

var followModel;
function FollowController (followModelInst) {
	followModel = followModelInst;
}

FollowController.prototype.router = router;

module.exports = FollowController;
//
//module.exports = {
//	followRouter,
//	setFollowModel
//}