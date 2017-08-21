var parameterStore = require('./../utils/parameterStore');
var mysql   = require('mysql2');
var co      = require('co');

var MySQL = {};


MySQL.getConnection = function (stage,config) {

	return co(function * () {
			var username;
			var password;
			if (stage == 'local') {
				username = 'user';
				password = 'password';
			} else {
				var credentials = yield parameterStore.getMYSQLCredentials();
				username = credentials.username;
				password = credentials.password;
			}
			
			return mysqlConnection = mysql.createConnection({
				host: config.DB_MYSQL_HOST,
				user: username,
				password : password, 
				database: config.DB_MYSQL_DATABASE,
			});
		});
		
}

module.exports = MySQL;