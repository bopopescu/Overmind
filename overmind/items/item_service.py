""" item_service.py: Items Service """

__author__ = "Michael Martin"

import logging
import uuid

from google.appengine.ext import ndb

# services
from management.keys import Keys
from tags.tag_service import TagService

# models
from models import Sites, UserItems, ItemTags, ItemFiles


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ITEM SERVICE
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ItemService(object):

    # createUserItem
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def createUserItem(user, siteURL, title, searchTags, note, userFiles, tags):

        # get or create new site from url
        site = ItemService.getOrCreateSite(siteURL)

        # create user item
        userItem = UserItems(user=user.key, site=site.key, title=title, search_tags=searchTags, note=note)
        userItem.put()

        # add file to itemFiles
        for fileID in userFiles:

            userFileKey = ndb.Key(urlsafe=fileID)
            userFile = userFileKey.get()

            itemFile = ItemFiles(user_item=userItem.key, user_file=userFile.key)
            itemFile.put()

        # add tag to itemTags
        for tag in tags:

            # get or create tag
            userTag = TagService.getOrCreateTag(tag, user)

            itemTag = ItemTags(user_item=userItem.key, user_tag=userTag.key)
            itemTag.put()

        return userItem

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
