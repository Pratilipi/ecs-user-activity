// Imports
var express = require('express');
var app     = require('./src/app');
var mysql   = require('./src/resources/mysql');
var co      = require('co');

// Load Configurations
var config = require( './src/config/main' )[ process.env.STAGE || 'local'];

co(function* (){
	// Initialize MySQL
	const mysqlPool = yield mysql.getPool(process.env.STAGE || 'local', config);

	// Initialize app
	var appInstance = app(mysqlPool, config);

	// Start server
	var server = appInstance.listen(config.PORT, function () {
	    console.log('Listening on %d', config.PORT);
	});

	module.exports = server;
});


