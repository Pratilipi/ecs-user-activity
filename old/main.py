"""User Activity Microservice v1.0
Primary gateway to get relationsghip details between User + Author & User + Pratilipi
"""

import os
import sys
import requests
import inspect
import bottle
import time

from datetime import datetime
from bottle import Bottle, route, run, request
application = Bottle()

# set the base path
sys.path.append("%s/src" % os.getcwd())
sys.path.append("%s/lib" % os.getcwd())
sys.path.append("%s/conf" % os.getcwd())

import v1
from commonfns import api_response, log_formatter, requested_api_version, timeit

print log_formatter(inspect.stack()[0][3], os.environ, "DEBUG")


@application.route('/health', method=['OPTIONS', 'GET'])
@application.route('/user-activity/health', method=['OPTIONS', 'GET'])
def health():
    """health - to check health of the api"""
    result = [200, "OK", {"state":"healthy"}]
    return api_response(result)


@application.route('/user-activity/is_add_to_lib', method=['OPTIONS', 'GET'])
@timeit
def is_add_to_lib():
    """method to check if library can be added"""
    # set default response
    result = [404, "Not Found"]

    if requested_api_version(request.headers) == 1.0:
        result = v1.batch_get_lib_status(request.query)
    return api_response(result)


@application.route('/user-activity/is_following_author', method=['OPTIONS', 'GET'])
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


