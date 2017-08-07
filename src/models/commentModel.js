// Initialize comment model
function CommentModel(mysql) {
    this.db = mysql;
}

// Dummy function
CommentModel.prototype.dummy = function () {
    console.log("In comment model dummy function");
};


module.exports = CommentModel;