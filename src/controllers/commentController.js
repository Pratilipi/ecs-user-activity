var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.status(200).send("Comment root route is reached");
});

var commentModel;
function CommentController (commentModelInst) {
	commentModel = commentModelInst;
}

CommentController.prototype.router = router;

module.exports = CommentController;