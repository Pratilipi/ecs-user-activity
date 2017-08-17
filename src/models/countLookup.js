// Initialize count-lookup model
function CountLookup(mysql) {
    this.db = mysql;
}

// function to update count
CountLookup.prototype.update = function (countLookup,type) {
	var that = this;
	
	if(type == 'MINUS') {
		 return new Promise(function (resolve, reject) {
		    	that.db.execute(
		    			'UPDATE COUNT_LOOKUP SET COUNT = COUNT-1 WHERE REFERENCE_ID = ? AND COUNT_TYPE = ?',
		    			[countLookup.referenceId,countLookup.countType],
		    			function(err, result) {
		    				if (err) {
		    					console.log(err);
		    	                return reject(err);
		    	            }
		    				resolve(result);
		    			}
		    	);
		    });	
	} else {
		 return new Promise(function (resolve, reject) {
		    	that.db.execute(
		    			'INSERT INTO COUNT_LOOKUP (REFERENCE_TYPE, REFERENCE_ID, COUNT_TYPE, COUNT) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE COUNT = COUNT+1',
		    			[countLookup.referenceType,countLookup.referenceId,countLookup.countType,1],
		    			function(err, result) {
		    				if (err) {
		    					console.log(err);
		    	                return reject(err);
		    	            }
		    				resolve(result);
		    			}
		    	);
		    });	
	}
	
   
};


CountLookup.prototype.get = function (referenceId, countType) {
	var that = this;
	return new Promise (function (resolve, reject) {
		that.db.query (
				'SELECT COUNT FROM COUNT_LOOKUP WHERE REFERENCE_ID = ? AND COUNT_TYPE = ?',
				[referenceId, countType],
				function (err, result) {
					if (err) {
						console.log(err);
						return reject(err);
					}
					resolve(result);
				}
		);
	});
}


module.exports = CountLookup;