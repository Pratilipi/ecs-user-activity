var express = require('express');
var testRouter = express.Router();

testRouter.get('/', function (req, res) {
	console.log("in the test request ");
	var that = this;
	var promise = testModel.getAll();
	
	promise.then((rows) => {
		console.log("sending response "+ rows);
	})
	.catch((err) => {
		console.log("error "+err);
	});
	
    res.send('test home page');
});

var testModel;
function TestController (testModelInst) {
	testModel = testModelInst;
}

TestController.prototype.testRouter = testRouter;

module.exports = TestController;
