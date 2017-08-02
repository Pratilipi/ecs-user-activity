// Initialize test model
function TestModel(mysql) {
    this.db = mysql;
}

// Function to test querying
TestModel.prototype.getAll = function () {
    var that = this;
    that.db.query('SELECT * from test_table', function(err, rows, fields) {
    	   if (!err)
    	     console.log('The solution is: ', rows);
    	   else
    	     console.log('Error while performing Query.');
    	 });
};

module.exports = TestModel;