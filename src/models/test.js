// Initialize test model
function Test(mysql) {
    this.db = mysql;
}

// Function to test querying
Test.prototype.getAll = function () {
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


module.exports = Test;