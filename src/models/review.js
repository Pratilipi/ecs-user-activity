// Initialize review model
function Review(pool) {
    this.pool = pool;
}

// Function to add review
Review.prototype.add = function (review) {
	
	console.log("Model: Adding review to database");
	var that = this;
    return new Promise(function (resolve, reject) {
    	that.pool.getConnection(function(err, connection) {
	    	connection.execute(
    			'INSERT INTO REVIEW (REVIEW,RATING,REFERENCE_TYPE,REFERENCE_ID,USER_ID,STATE) VALUES (?,?,?,?,?,?)',
    			[review.review,review.rating,review.referenceType,review.referenceId,review.userId,review.state],
    			function(err, result) {
    				connection.release();
    				if (err) {
    	                return reject(err);
    	            }
    				resolve(result);
    			}
	    	);
    	});
    });	
};

// Function to return list of reviews by reference
Review.prototype.getByReference = function (referenceId) {
	
	console.log("Model: Getting list of reviews from database by reference id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.pool.getConnection(function(err, connection) {
			connection.query(
				'SELECT * FROM REVIEW WHERE REFERENCE_ID = ? LIMIT 0,5',
				[referenceId],	
				function (err, result, fields) {
					connection.release();
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
			);
		});
	});
};

// Function to get review by id
Review.prototype.get = function (id) {
	
	console.log("Model: Getting review from database by id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.pool.getConnection(function(err, connection) {
			connection.query(
				'SELECT * FROM REVIEW WHERE ID = ?',
				[id],
				function (err, result, fields) {
					connection.release();
					if (err) {
						return reject(err);
					}
					resolve(result);
				}
			);
		});
	});
}


// Function to update review
Review.prototype.update = function (map,id) {
	
	console.log("Model: Update review in database");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.pool.getConnection(function(err, connection) {
			connection.query(
				'UPDATE REVIEW SET ? WHERE ID = ?',
				[map, id],
				function (err, result, fields) {
					connection.release();
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
	});
}


// Function to delete review
Review.prototype.delete = function (id) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.pool.getConnection(function(err, connection) {
			connection.query(
				'UPDATE REVIEW SET STATE=\'DELETED\' WHERE ID = ?',
				[id],
				function (err, result, fields) {
					connection.release();
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
	});
}

module.exports = Review;