var express = require('express');
var sampleRouter = express.Router();

sampleRouter.get('/', function (req, res) {
	console.log("in the sample request ");
	var that = this;
	var promise = sampleModel.getAll();
	
	promise.then((rows) => {
		console.log("sending response "+ rows);
	})
	.catch((err) => {
		console.log("error "+err);
	});
    res.status('200').send('{"messaeg":"sample run"}');
});

var sampleModel;
function Sample (sampleModelInst) {
	sampleModel = sampleModelInst;
}

Sample.prototype.sampleRouter = sampleRouter;

module.exports = Sample;
