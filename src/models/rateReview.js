// Initialize rate-review model
function RateReview(mysql) {
    this.db = mysql;
}

// Function to add rate-review
RateReview.prototype.add = function (rateReview) {
	
	console.log("Model: Adding rate-review to database");
	var that = this;
    return new Promise(function (resolve, reject) {
    	that.db.execute(
    			'INSERT INTO RATE_REVIEW (REVIEW,RATING,REFERENCE_TYPE,REFERENCE_ID,USER_ID,STATE) VALUES (?,?,?,?,?,?)',
    			[rateReview.review,rateReview.rating,rateReview.referenceType,rateReview.referenceId,rateReview.userId,rateReview.state],
    			function(err, result) {
    				if (err) {
    	                return reject(err);
    	            }
    				resolve(result);
    			}
    	);
    });	
};

// Function to return list of rate-reviews by reference
RateReview.prototype.getByReference = function (referenceId) {
	
	console.log("Model: Getting list of rate-reviews from database by reference id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM RATE_REVIEW WHERE REFERENCE_ID = ? LIMIT 0,5',
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

// Function to get rate-review by id
RateReview.prototype.get = function (id) {
	
	console.log("Model: Getting rate-review from database by id");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'SELECT * FROM RATE_REVIEW WHERE ID = ?',
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


// Function to update rate-review
RateReview.prototype.update = function (map,id) {
	
	console.log("Model: Update rate-review in database");
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'UPDATE RATE_REVIEW SET ? WHERE ID = ?',
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


// Function to delete rate-review
RateReview.prototype.delete = function (id) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.db.query(
				'UPDATE RATE_REVIEW SET STATE=\'DELETED\' WHERE ID = ?',
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

module.exports = RateReview;