var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	console.log(req.referenceType+" "+req.referenceId);
	res.status(200).send("Rate-Review root route is reached");
});

var rateReviewModel;
function RateReviewController (rateReviewModelInst) {
	rateReviewModel = rateReviewModelInst;
}

RateReviewController.prototype.router = router;

module.exports = RateReviewController;