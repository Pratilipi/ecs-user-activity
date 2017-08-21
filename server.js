// Imports
var express = require('express');
var app     = require('./src/app');
var mysql   = require('./src/resources/mysql');

// Load Configurations
var config = require( './src/config/main' )[ process.env.STAGE || 'local'];

// Initialize MySQL
const mysqlConnection = mysql.getConnection(process.env.STAGE || 'local', config);


// Initialize app
var appInstance = app(mysqlConnection, config);

// Start server
var server = appInstance.listen(config.PORT, function () {
    console.log('Listening on %d', config.PORT);
});

module.exports = server;

