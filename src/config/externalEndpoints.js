var config = {};

config.ALL_LANGUAGE_HOSTNAME = 'www.pratilipi.com';
config.AUTHOR_ENDPOINT = `${process.env.API_END_POINT}/authors`;
config.AUTH_ENDPOINT = `${process.env.API_END_POINT}/auth/isAuthorized`;

config.PARAMETER_STORE_MYSQL_USERNAME = '/ecs/user-activity/mysql/username';
config.PARAMETER_STORE_MYSQL_PASSWORD = '/ecs/user-activity/mysql/password';

module.exports = config;
