"""keys.py: Save and Retrieve keys from Datastore """

__author__ = "Michael Martin"

import logging

from google.appengine.api import memcache

from models import ApiKeys


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Keys
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Keys(object):

    # set_key
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def set_key(name, value):

        # get existing key
        apiKey = ApiKeys.query(ApiKeys.name == name).get()

        # update existing name
        if apiKey:
            apiKey.name = name
            apiKey.value = value

        # create new key
        else:
            apiKey = ApiKeys(
                name=name,
                value=value
            )

        apiKey.put()

        # save to memcache
        if not memcache.add(name, value):

            # update memcache
            memcache.set(key=name, value=value)

        return 'name=%s value=%s' % (name, value)

    # get_key
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def get_key(name):

        # find key in memcache
        apiKey = memcache.get(name)

        # key not found in memcache
        if not apiKey:

            # fetch from ApiKeys table
            apiKeyRecord = ApiKeys.query(ApiKeys.name == name).get()

            if apiKeyRecord:
                # save to memcache
                if not memcache.add(apiKeyRecord.name, apiKeyRecord.value):
                    logging.error('memcache set failed')

            apiKey = apiKeyRecord.value

        return str(apiKey)
