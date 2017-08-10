// Initialize rate-review model
function RateReviewModel(mysql) {
    this.db = mysql;
}

// Dummy function
RateReviewModel.prototype.dummy = function () {
    console.log("In rate-review model dummy function");
};


module.exports = RateReviewModel;