// Initialize vote model
function VoteModel(mysql) {
    this.db = mysql;
}

// Dummy function
VoteModel.prototype.dummy = function () {
    console.log("In vote model dummy function");
};


module.exports = VoteModel;