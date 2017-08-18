// Initialize comment model
function Comment(mysql) {
    this.db = mysql;
}

//function to add comment
Comment.prototype.add = function (comment) {
	
	console.log("Model: Adding comment to database");
	var that = this;
    return new Promise(function (resolve, reject) {
    	that.db.execute(
    			'INSERT INTO COMMENT (COMMENT,REFERENCE_TYPE,REFERENCE_ID,USER_ID,STATE) VALUES (?,?,?,?,?)',
    			[comment.comment,comment.referenceType,comment.referenceId,comment.userId,comment.state],
    			function(err, result) {
    				if (err) {
    	                return reject(err);
    	            }
    				resolve(result);
    			}
    	);
    });	
};


// Function to return list of comments by reference
Comment.prototype.getByReference = function (referenceId) {
	
	console.log("Model: Getting list of comments from database by reference id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM COMMENT WHERE REFERENCE_ID = ? LIMIT 0,5',
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


// Function to get comment by id
Comment.prototype.get = function (id) {
	
	console.log("Model: Getting comment from database by id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM COMMENT WHERE ID = ?',
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


// Function to update comment
Comment.prototype.update = function (map,id) {
	
	console.log("Model: Update comment in database");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'UPDATE COMMENT SET ? WHERE ID = ?',
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


//Function to delete comment
Comment.prototype.delete = function (id) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'UPDATE COMMENT SET STATE=\'DELETED\' WHERE ID = ?',
				[id],
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

module.exports = Comment;