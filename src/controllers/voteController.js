var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.status(200).send("Vote root route is reached");
});

var voteModel;
function VoteController (voteModelInst) {
	voteModel = voteModelInst;
}

VoteController.prototype.router = router;

module.exports = VoteController;