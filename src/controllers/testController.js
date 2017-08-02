var express = require('express');
var testRouter = express.Router();

var testModel;

// Injecting testModel
function setTestModel(mysql) {
	testModel = mysql;
}

// test route
testRouter.get('/', function (req, res) {
	testModel.getAll();
    res.send('test home page');
});

module.exports = {
	testRouter,
	setTestModel
}