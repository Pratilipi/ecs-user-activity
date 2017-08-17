var dbUtility = require( '../../lib/DbUtility.js' );

var UserPratilipiSchema = {
	structure : {
		'ID'		: { 'type' : 'STRING', 'default' : null },
		'ADDED_TO_LIB'	: { 'type' : 'BOOLEAN', 'default' : false },
		'PRATILIPI_ID' : { 'type' : 'INTEGER', 'default' : 0}
	},primaryKey  : 'ID'
};



var bookmarks = [
	{
		"ID": "101-1001",
		"ADDED_TO_LIB": false,
		"PRATILIPI_ID": 1001
	},
	{
		"ID": "101-1002",
		"ADDED_TO_LIB": true,
		"PRATILIPI_ID": 1002
	},
	{
		"ID": "101-1003",
		"ADDED_TO_LIB": false,
		"PRATILIPI_ID": 1003
	},
	{
		"ID": "101-1004",
		"ADDED_TO_LIB": true,
		"PRATILIPI_ID": 1004
	},
];



function Library (config) {
	// initialize db utility
	dbUtility = dbUtility( { projectId: config.projectId, kind: 'USER_PRATILIPI', 'schema' : UserPratilipiSchema} );
}

//Function to return if Pratilipi is added to library
Library.prototype.list = function (ids) {
	console.log(ids);
	return dbUtility.list(ids)
	.then ((data) => {
		return data;
	});
	throw 'ENTITY NOT FOUND';
};

Library.prototype.insert = function () {
	for (var i = 0; i < bookmarks.length; i++) {
	  dbUtility.insert(bookmarks[i]);
	}
};

module.exports = Library;