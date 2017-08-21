// Initialize sample model
function Sample(mysql) {
    this.db = mysql;
}

// Function to test select querying
Sample.prototype.getAll = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
    	that.db.query('SELECT * from test_table', function(err, rows, fields) {
    		if (err) {
                return reject(err);
            }
            resolve(rows);
    	 });
    });
};


module.exports = Sample;