// Initialize vote model
function Vote(mysql) {
    this.db = mysql;
}

// Dummy function
Vote.prototype.dummy = function () {
    console.log("In vote model dummy function");
};


module.exports = Vote;