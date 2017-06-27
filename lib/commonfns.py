import re
import os

from datetime import datetime
import time
import simplejson as json

def requested_api_version(data):
    accepttxt = data.get('Accept', "Version=1.0")
    searchtxt = re.search(r'Version=(\d.\d)', accepttxt.lower())
    version = 1.0
    accepttxt = data.get('Accept', "Version=1.0")
    if searchtxt:
        version = searchtxt.group()[-3:]
    return version


def api_response(result):
    response = {}
    if result[0] != 200:
        response = {"message": result[1]}
    else:
        if len(result) > 2:
            response = result[2]

    response = json.dumps(response)
    return response


def log_formatter(fname, msg, level="INFO"):
    hostname = os.uname()[1]
    pid = os.getpid()
    return "[%s] [%s] [%s] [%s] [%s] - %s" % (datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"), hostname, pid, level, fname, msg)


def timeit(method):
    def timed(*args, **kw):
        print log_formatter(method.__name__, "start")
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()

        ft = "timetaken - {0:.2f} sec".format(te-ts)
        print log_formatter(method.__name__, "done")
        print log_formatter(method.__name__, ft)
        return result
    return timed

