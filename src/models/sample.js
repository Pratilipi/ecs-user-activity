// Initialize sample model
function Sample(pool) {
    this.pool = pool;
}

// Function to test select querying
Sample.prototype.getAll = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
    	that.pool.getConnection(function(err, connection) {
	    	
    		connection.query('SELECT * from test_table', function(err, rows, fields) {
	    		if (err) {
	                return reject(err);
	            }
	            resolve(rows);
    		});
    	});
    });
};


module.exports = Sample;