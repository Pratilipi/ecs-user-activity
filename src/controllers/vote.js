var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.status(200).send("Vote root route is reached");
});

var voteModel;
function Vote (voteModelInst) {
	voteModel = voteModelInst;
}

Vote.prototype.router = router;

module.exports = Vote;