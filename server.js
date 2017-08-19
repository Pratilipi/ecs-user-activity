// Imports
var express = require('express');
var mysql   = require('mysql2');
var app     = require('./src/app');

// Load Configurations
var config = require( './src/config/main' )[ process.env.STAGE || 'local'];


// Initialize MySQL
const mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'user_activity',
});

//var mysqlConnection;

// Initialize app
var appInstance = app(mysqlConnection, config);

// Start server
var server = appInstance.listen(config.PORT, function () {
    console.log('Listening on %d', config.PORT);
});

module.exports = server;

