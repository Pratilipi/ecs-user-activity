"""User Activity Microservice v1.0
Primary gateway to get relationsghip details between User + Author & User + Pratilipi
"""

import os
import sys
import requests
import inspect
import bottle
import time
import redis

from datetime import datetime
from google.cloud import datastore
from bottle import Bottle, route, run, request
application = Bottle()

# set the base path
sys.path.append("%s/src" % os.getcwd())
sys.path.append("%s/lib" % os.getcwd())
sys.path.append("%s/conf" % os.getcwd())

import v1
from commonfns import api_response, log_formatter, requested_api_version, timeit

print log_formatter(inspect.stack()[0][3], os.environ, "DEBUG")

#config
import config
global CONFIG
CONFIG = {'CACHE_HOST': config.CACHE_HOST,
          'CACHE_PORT': config.CACHE_PORT,
          'CACHE_DB': config.CACHE_DB,
          'PROJECT_ID': config.PROJECT_ID,}
print log_formatter(inspect.stack()[0][3], CONFIG, "DEBUG")


global DS_CONN
DS_CONN = datastore.Client(CONFIG['PROJECT_ID'])

global UA_CACHE_CONN
pool = redis.ConnectionPool(host=CONFIG["CACHE_HOST"], port=CONFIG["CACHE_PORT"], db=7)
UA_CACHE_CONN = redis.Redis(connection_pool=pool)

global UP_CACHE_CONN
pool = redis.ConnectionPool(host=CONFIG["CACHE_HOST"], port=CONFIG["CACHE_PORT"], db=9)
UP_CACHE_CONN = redis.Redis(connection_pool=pool)


@application.route('/health', method=['OPTIONS', 'GET'])
@application.route('/user_activity/health', method=['OPTIONS', 'GET'])
def health():
    """health - to check health of the api"""
    result = [200, "OK", {"state":"healthy"}]
    return api_response(result)


@application.route('/user_activity/is_add_to_lib', method=['OPTIONS', 'GET'])
@timeit
def is_add_to_lib():
    """method to check if library can be added"""
    # set default response
    result = [404, "Not Found"]

    if requested_api_version(request.headers) == 1.0:
        result = v1.batch_get_lib_status(request.query)
    return api_response(result)


@application.route('/user_activity/is_following_author', method=['OPTIONS', 'GET'])
@timeit
def is_following_author():
    """method to check if user is following author"""
    # set default response
    result = [404, "Not Found"]

    if requested_api_version(request.headers) == 1.0:
        result = v1.batch_get_following_status(request.query)
    return api_response(result)


if __name__ == '__main__':
    print log_formatter(inspect.stack()[0][3], "start running author service", "INFO")
    run(application, host='127.0.0.1', port=8080)


