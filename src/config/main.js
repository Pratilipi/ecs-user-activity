var config = {};

config.devo = {
  'PORT': 80,
  'SERVICE': 'ecs-user-activity-devo',
  'DB_MYSQL_HOST' : 'ecs-devo-user-activity.ctl0cr5o3mqq.ap-southeast-1.rds.amazonaws.com:3306',
  'DB_MYSQL_DATABASE': 'user_activity' 
};

config.gamma = {
  'PORT': 80,
  'SERVICE': 'ecs-user-activity-gamma'
};

config.prod = {
  'PORT': 80,
  'SERVICE': 'ecs-user-activity-prod'
};

config.local = {
  'PORT' : 8090,
  'GCP_PROJ_ID' : 'devo-pratilipi',
  'DB_MYSQL_HOST' : 'localhost',
  'DB_MYSQL_DATABASE': 'user_activity' 
};

module.exports = config;
