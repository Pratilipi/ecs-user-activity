var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
var ssm = new AWS.SSM();
var externalEndpoints = require('./../config/externalEndpoints');


var ParameterStore = {};

ParameterStore.getMYSQLCredentials = function (stage) {
	
	function credentials(username, password) {
		this.username = username;
		this.password = password;
	}
	
	var credits = new Promise(function(resolve, reject) {
		var params = {
			Names: [
				externalEndpoints.PARAMETER_STORE_MYSQL_USERNAME,
				externalEndpoints.PARAMETER_STORE_MYSQL_PASSWORD
				],
				WithDecryption: true
	    	};
		ssm.getParameters(params, function(err, data) {
			if (err) {
				reject (err)
			}
			
			for (var i in data.Parameters) {
				var obj = data.Parameters[i];
				var username;
				var password;
				if (obj.Name == externalEndpoints.PARAMETER_STORE_MYSQL_USERNAME) {
					username = obj.Value;
				} else if (obj.Name == externalEndpoints.PARAMETER_STORE_MYSQL_PASSWORD) {
					password = obj.Value;
				}
			}
			resolve(new credentials(username,password));
	    });
	});
	
	return credits;
}


module.exports = ParameterStore;