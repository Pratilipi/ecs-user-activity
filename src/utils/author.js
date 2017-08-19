var http = require('http');
var https = require('https');
var httpPromise = require('request-promise');

var externalEndpoints = require('./../config/externalEndpoints');

var agent = new http.Agent({
  keepAlive : true
});

var httpsAgent = new https.Agent({
  keepAlive : true
});


function Author () {
	
}

// Get author by authorId
Author.prototype.getAuthorById = function (id) {
	return new Promise(function (resolve, reject) {
		var url = `${externalEndpoints.AUTHOR_ENDPOINT}/`+id;
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

module.exports = Author;