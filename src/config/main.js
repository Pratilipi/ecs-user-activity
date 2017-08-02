var config = {};

config.devo = {
  'PORT': 80,
  'SERVICE': 'ecs-user-activity-devo'
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
  'PORT' : 8080,
  'GCP_PROJ_ID' : 'devo-pratilipi'
};

module.exports = config;
