// Initialize comment model
function Comment(mysql) {
    this.db = mysql;
}

// Dummy function
Comment.prototype.dummy = function () {
    console.log("In comment model dummy function");
};


module.exports = Comment;