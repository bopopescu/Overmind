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

    # getUserItems
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserItems(user):

        userItems = UserItems.query(UserItems.user == user.key).fetch()

        if userItems:

            userItemsList = []

            # construct python dictionary
            for userItem in userItems:

                # get site
                site = userItem.site.get()

                # get item tags
                itemTags = ItemTags.query(ItemTags.user_item == userItem.key)
                itemTagsList = []
                for itemTag in itemTags:

                    userTag = itemTag.user_tag.get()
                    itemTagsList.append({
                        'id': userTag.key.urlsafe(),
                        'title': userTag.title,
                        'slug': userTag.slug
                    })

                # get item files
                itemFiles = ItemFiles.query(ItemFiles.user_item == userItem.key)
                itemFilesList = []
                for itemFile in itemFiles:

                    userFile = itemFile.user_file.get()
                    itemFilesList.append({
                        'id': userFile.key.urlsafe(),
                        'file_location': userFile.file_location,
                        'file_type': userFile.file_type,
                        'title': userFile.title,
                        'caption': userFile.caption
                    })

                # serialize user items
                userItemsList.append({
                    'id': userItem.key.urlsafe(),
                    'site': site.url,
                    'site_popularity': site.popularity,
                    'search_tags': userItem.search_tags,
                    'title': userItem.title,
                    'rating': userItem.rating,
                    'note': userItem.note,
                    'date_added': str(userItem.date_added),
                    'date_modified': str(userItem.date_modified),
                    'item_files': itemFilesList,
                    'item_tags': itemTagsList
                })

            return userItemsList

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
