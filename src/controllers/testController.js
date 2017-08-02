var express = require('express');
var testRouter = express.Router();

var testModel;

// Injecting testModel
function setTestModel(model) {
	testModel = model;
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