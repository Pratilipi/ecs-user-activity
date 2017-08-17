var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	console.log(req.referenceType+" "+req.referenceId);
	res.status(200).send("Comment root route is reached");
});

var commentModel;
function Comment (commentModelInst) {
	commentModel = commentModelInst;
}

Comment.prototype.router = router;

module.exports = Comment;