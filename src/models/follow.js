// Initialize follow model
function Follow(mysql) {
    this.db = mysql;
}

//Function to add follow
Follow.prototype.add = function (follow) {
	
	console.log("Model: Adding follow to database");
	var that = this;
    return new Promise(function (resolve, reject) {
    	that.db.execute(
    			'INSERT INTO FOLLOW (REFERENCE_TYPE,REFERENCE_ID,USER_ID,STATE) VALUES (?,?,?,?)  ON DUPLICATE KEY UPDATE STATE = ?',
    			[follow.referenceType,follow.referenceId,follow.userId,follow.state,follow.state],
    			function(err, result) {
    				if (err) {
    	                return reject(err);
    	            }
    				resolve(result);
    			}
    	);
    });	
};


//Function to return list of follows by reference
Follow.prototype.getByReference = function (referenceId) {
	
	console.log("Model: Getting list of follows from database by reference id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM FOLLOW WHERE REFERENCE_ID = ? LIMIT 0,5',
				[referenceId],	
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
};


//Function to return list of follows by userId
Follow.prototype.getByUser = function (userId) {
	
	console.log("Model: Getting list of follows from database by user id "+userId);
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM FOLLOW WHERE USER_ID = ? LIMIT 0,5',
				[userId],	
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
};


//Function to return list of follows by reference and user
Follow.prototype.getByRefernceAndUser = function (referenceId,userId) {
	
	console.log("Model: Getting follows from database by reference id and user id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM FOLLOW WHERE REFERENCE_ID = ? AND USER_ID = ?',
				[referenceId, userId],	
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
};




/*
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
*/

module.exports = Follow;