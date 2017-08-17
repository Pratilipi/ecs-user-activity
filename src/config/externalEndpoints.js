var config = {};

config.ALL_LANGUAGE_HOSTNAME = 'www.pratilipi.com';
config.AUTHOR_ENDPOINT = `${process.env.API_END_POINT}/authors`;
config.AUTH_ENDPOINT = `${process.env.API_END_POINT}/auth/isAuthorized`;


module.exports = config;
