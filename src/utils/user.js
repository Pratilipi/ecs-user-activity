var http = require('http');
var https = require('https');
//var Promise = require('bluebird');
var httpPromise = require('request-promise');

var externalEndpoints = require('./../config/externalEndpoints');

var agent = new http.Agent({
  keepAlive : true
});

var httpsAgent = new https.Agent({
  keepAlive : true
});


function User () {
	
}

// Get user by userId
User.prototype.getUserById = function (id) {
	return new Promise(function (resolve, reject) {
		var url = `${externalEndpoints.AUTHOR_ENDPOINT}?userId=`+id;
        var options = {
          uri: url,
          agent : agent,
          json: true
        };
        httpPromise(options)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
        ;
	});
}

module.exports = User;