""" item_service.py: Items Service """

__author__ = "Michael Martin"

import logging
import uuid

# services
from management.keys import Keys

# models
from models import Users, Files, Tags, Sites, UserFiles


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ITEM SERVICE
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ItemService(object):

    # Get or Create Site
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getOrCreateSite(url):

        # get or create site
        site = Sites.query(Sites.url == url).get()

        # create site
        if site is None:

            # create site
            site = Sites(url=url)
            site.put()

        return site
