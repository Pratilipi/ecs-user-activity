// Initialize vote model
function Vote(mysql) {
    this.db = mysql;
}

//Function to add vote
Vote.prototype.add = function (vote) {
	console.log("Model: Adding vote to database");
	var that = this;
    return new Promise(function (resolve, reject) {
    	that.db.execute(
    			'INSERT INTO VOTE (TYPE,REFERENCE_TYPE,REFERENCE_ID,USER_ID) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE TYPE = ?',
    			[vote.type,vote.referenceType,vote.referenceId,vote.userId,vote.type],
    			function(err, result) {
    				if (err) {
    	                return reject(err);
    	            }
    				resolve(result);
    			}
    	);
    });	
};


//Function to return list of votes by reference
Vote.prototype.getByReference = function (referenceId, type) {
	
	console.log("Model: Getting list of votes from database by reference id and type");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM VOTE WHERE REFERENCE_ID = ? AND TYPE = ? LIMIT 0,5',
				[referenceId, type],	
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
};

// Function to get vote by reference id and user id
Vote.prototype.getByReferenceIdAndUserId = function (referenceId, userId) {
	console.log("Model: Getting vote from database by reference id and user id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM VOTE WHERE REFERENCE_ID = ? AND USER_ID = ?',
				[referenceId, userId],	
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
}


//Function to get vote by id
Vote.prototype.get = function (id) {
	
	console.log("Model: Getting vote from database by id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM VOTE WHERE ID = ?',
				[id],
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
		);
	});
}


//Function to update vote
Vote.prototype.update = function (map,id) {
	
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'UPDATE VOTE SET ? WHERE ID = ?',
				[map, id],
				function (err, result, fields) {
					if (err) {
						return reject(err);
					}
					if (result.affectedRows > 0) {
						resolve(true);
					} else {
						resolve(false);
					}
				}
		);
	});
}

module.exports = Vote;