import os

CACHE_HOST = "localhost"
CACHE_PORT = 8080

if os.environ["STAGE"] == "gamma":
    CACHE_HOST = "ecs-user-activit-001.cpzshl.0001.apse1.cache.amazonaws.com"
elif os.environ["STAGE"] == "prod":
    CACHE_HOST = "ecs-user-activit-001.cpzshl.0001.apse1.cache.amazonaws.com"
elif os.environ["STAGE"] == "devo":
    CACHE_HOST = "ecs-user-activity.e6ocw5.0001.apse1.cache.amazonaws.com"
elif os.environ["STAGE"] == "local":
    CACHE_HOST = "localhost"
    CACHE_PORT = 6379


PROJECT_ID = os.environ["GCP_PROJ_ID"]

