// Imports
var express = require('express');
var mysql   = require('mysql2');
var app     = require('./app');

// Load Configurations
var config = require( './config/main' )[ process.env.STAGE || 'local'];

// Initialize MySQL
const mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'testOne',
});

// Initialize app
var appInstance = app(mysqlConnection);

// Start server
var server = appInstance.listen(config.PORT, function () {
    console.log('Listening on %d', config.PORT);
});

module.exports = server

