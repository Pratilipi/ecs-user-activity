var dbUtility = require( '../../lib/DbUtility.js' );

var UserAuthorSchema = {
		structure : {
			'ID'		: { 'type' : 'STRING', 'default' : null },
			'FOLLOWING'	: { 'type' : 'BOOLEAN', 'default' : false },
			'AUTHOR_ID' : { 'type' : 'INTEGER', 'default' : 0},
			'USER_ID'   : { 'type' : 'INTEGER', 'default' : 0}
		},primaryKey  : 'ID'
	};


var follows = [
	{
		"ID": "101-1001",
		"FOLLOWING": false,
		"AUTHOR_ID": 1001,
		"USER_ID": 101
	},
	{
		"ID": "101-1002",
		"FOLLOWING": true,
		"AUTHOR_ID": 1002,
		"USER_ID": 101
	},
	{
		"ID": "101-1003",
		"FOLLOWING": false,
		"AUTHOR_ID": 1003,
		"USER_ID": 101
	},
	{
		"ID": "101-1004",
		"FOLLOWING": true,
		"AUTHOR_ID": 1004,
		"USER_ID": 101
	},
];

function Follow (config) {
	// initialize db utility
	dbUtility = dbUtility( { projectId: config.projectId, kind: 'USER_AUTHOR', 'schema' : UserAuthorSchema} );
}

//Function to return if user is following author
Follow.prototype.list = function (ids) {
	console.log(ids);
	return dbUtility.list(ids)
	.then ((data) => {
		return data;
	});
	throw 'ENTITY NOT FOUND';
};

Follow.prototype.insert = function () {
	for (var i = 0; i < follows.length; i++) {
	  dbUtility.insert(follows[i]);
	}
};

module.exports = Follow;