import simplejson as json
import inspect
import redis
import config

from commonfns import log_formatter
from google.cloud import datastore

#config
global CONFIG
CONFIG = {'CACHE_HOST': config.CACHE_HOST,
          'CACHE_PORT': config.CACHE_PORT,
          'PROJECT_ID': config.PROJECT_ID,}
print log_formatter(inspect.stack()[0][3], CONFIG, "DEBUG")

#connect to db
global DS_CONN
DS_CONN = datastore.Client(CONFIG['PROJECT_ID'])
print log_formatter(inspect.stack()[0][3], "just got connected to db" , "DEBUG")

#connect to redis
global UA_CACHE_CONN
pool = redis.ConnectionPool(host=CONFIG["CACHE_HOST"], port=CONFIG["CACHE_PORT"], db=7)
UA_CACHE_CONN = redis.Redis(connection_pool=pool)

global UP_CACHE_CONN
pool = redis.ConnectionPool(host=CONFIG["CACHE_HOST"], port=CONFIG["CACHE_PORT"], db=9)
UP_CACHE_CONN = redis.Redis(connection_pool=pool)
print log_formatter(inspect.stack()[0][3], "just got connected to cache" , "DEBUG")
 

def batch_get_lib_status(data):
    """batch call to get library status"""
    user_id  = data.get('userId', 0)
    pratilipi_id_list  = data.get('pratilipiIds', None)

    #validate
    if user_id == 0:
        return [400, "Bad Request"]

    if pratilipi_id_list is None or pratilipi_id_list == '':
        return [400, "Bad Request"]

    pratilipi_id_list = pratilipi_id_list.strip("[]")
    pratilipi_id_list = pratilipi_id_list.split(',')

    #get data if available in cache
    temp = {}
    not_found = {}
    for pratilipi_id in pratilipi_id_list:
        key = "{}-{}".format(user_id, pratilipi_id)
        temp[key] = {"pratilipiId": pratilipi_id, "addedToLib": False}

        can_add_to_lib = UP_CACHE_CONN.get(key)
        if can_add_to_lib is not None:
            #found in cache
            temp[key] = {"pratilipiId": pratilipi_id, "addedToLib": bool(int(can_add_to_lib))}
            print log_formatter(inspect.stack()[0][3], "found in cache - {}".format(key) , "DEBUG")
        else:
            #not found in cache
            not_found[key] = None
            print log_formatter(inspect.stack()[0][3], "not found in cache - {}".format(key) , "DEBUG")

    for entity_id in not_found:
        #fetch data from datastore
        key = DS_CONN.key("USER_PRATILIPI", entity_id)
        not_found[entity_id] = key

    #prepare response
    entities = DS_CONN.get_multi(not_found.values())
    for entity in entities:
        key = entity.key.name
        val = entity.get('ADDED_TO_LIB', False)
        temp[key]["addedToLib"] = val
        UP_CACHE_CONN.set(key, int(val)) #cache data
        print log_formatter(inspect.stack()[0][3], "setting cache - {}".format(key) , "DEBUG")

    response = temp.values()
    return [200, 'Success', response]


def batch_get_following_status(data):
    """batch call to get following status"""
    user_id  = data.get('userId', 0)
    author_id_list  = data.get('authorIds', None)

    #validate
    if user_id == 0:
        return [400, "Bad Request"]

    if author_id_list is None or author_id_list == '':
        return [400, "Bad Request"]

    author_id_list = author_id_list.strip("[]")
    author_id_list = author_id_list.split(',')

    #get data if available in cache
    temp = {}
    not_found = {}
    for author_id in author_id_list:
        key = "{}-{}".format(user_id, author_id)
        temp[key] = {"authorId": author_id, "following": False}

        following = UA_CACHE_CONN.get(key)
        if following is not None:
            #found in cache
            temp[key] = {"authorId": author_id, "following": bool(int(following))}
            print log_formatter(inspect.stack()[0][3], "found in cache - {}".format(key) , "DEBUG")
        else:
            #not found in cache
            not_found[key] = None
            print log_formatter(inspect.stack()[0][3], "not found in cache - {}".format(key) , "DEBUG")

    for entity_id in not_found:
        #fetch data from datastore
        key = DS_CONN.key("USER_AUTHOR", entity_id)
        not_found[entity_id] = key


    entities = DS_CONN.get_multi(not_found.values())
    for entity in entities:
        key = entity.key.id
        print "----> key, ", key
        #key = entity.key.name
        val = entity.get('FOLLOW_STATE', None)
        print "-----> val, ", val
        temp[key]["following"] = True if val == 'FOLLOWING' else False
        UA_CACHE_CONN.set(key, int(val)) #cache data

    response = temp.values()
    return [200, 'Success', response]

