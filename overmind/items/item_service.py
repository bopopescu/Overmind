""" item_service.py: Items Service """

__author__ = "Michael Martin"

import logging
import uuid

from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor

# services
from management.keys import Keys
from tags.tag_service import TagService

# models
from models import Sites, UserItems, ItemTags, ItemFiles


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ITEM SERVICE
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ItemService(object):

    # getUserItem - GET
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserItem(itemID):

        # get item by key
        itemKey = ndb.Key(urlsafe=itemID)
        userItem = itemKey.get()

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
                'url': userFile.file_location,
                'file_type': userFile.file_type,
                'title': userFile.title,
                'caption': userFile.caption
            })

        # serialize user item
        userItemObj = {
            'id': itemID,
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
        }

        return userItemObj

    # updateUserItem - UPDATE
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def updateUserItem(itemID, user, siteURL, title, searchTags, note, userFiles, tags):

        # get or create new site from url
        site = ItemService.getOrCreateSite(siteURL)

        itemKey = ndb.Key(urlsafe=itemID)
        userItem = itemKey.get()

        # update user item
        userItem.site = site.key
        userItem.title = title
        userItem.search_tags = searchTags
        userItem.note = note
        userItem.put()

        # remove item files
        try:
            itemFiles = ItemFiles.query(ItemFiles.user_item == itemKey).fetch()

            for itemFile in itemFiles:
                itemFile.key.delete()

        except Exception:
            pass

        # remove item tags
        try:
            itemTags = ItemTags.query(ItemTags.user_item == itemKey).fetch()

            for itemTag in itemTags:
                itemTag.key.delete()

        except Exception:
            pass

        # add files to itemFiles
        for fileID in userFiles:

            userFileKey = ndb.Key(urlsafe=fileID)
            userFile = userFileKey.get()

            itemFile = ItemFiles(user_item=userItem.key, user_file=userFile.key)
            itemFile.put()

        # add tags to itemTags
        for tag in tags:

            # get or create tag
            userTag = TagService.getOrCreateTag(tag, user)

            itemTag = ItemTags(user_item=userItem.key, user_tag=userTag.key, user=user.key)
            itemTag.put()

        return userItem

    # createUserItem - CREATE
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

            itemTag = ItemTags(user_item=userItem.key, user_tag=userTag.key, user=user.key)
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

    # getUserTagItems
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserTagItems(user, userTag, cursorString):

        # get user tag
        userTag = TagService.getOrCreateTag(userTag, user)

        # get next page
        if (cursorString != ''):
            inputCursor = Cursor(urlsafe=cursorString)

            # get User items tag == userTag
            userTagItemsQuery, cursor, more = ItemTags.query(ItemTags.user_tag == userTag.key, ItemTags.user == user.key).fetch_page(2, start_cursor=inputCursor)

        # first page
        else:
            userTagItemsQuery, cursor, more = ItemTags.query(ItemTags.user_tag == userTag.key, ItemTags.user == user.key).fetch_page(2)

        cursorURLSafe = cursor.urlsafe()

        userItems = {
            'user_items_list': [],
            'cursor': cursorURLSafe,
            'more': more
        }

        if userTagItemsQuery:

            # construct python dictionary
            for userTagItem in userTagItemsQuery:

                # get user item as object
                userItemObj = ItemService.getUserItem(userTagItem.user_item.urlsafe())

                # insert into user items list
                userItems['user_items_list'].append(userItemObj)

            return userItems

    # getUserItems
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    @staticmethod
    def getUserItems(user, cursorString):

        # get next page
        if (cursorString != ''):
            inputCursor = Cursor(urlsafe=cursorString)
            userItemsQuery, cursor, more = UserItems.query(UserItems.user == user.key).fetch_page(2, start_cursor=inputCursor)

        # first page
        else:
            userItemsQuery, cursor, more = UserItems.query(UserItems.user == user.key).fetch_page(2)

        cursorURLSafe = cursor.urlsafe()

        userItems = {
            'user_items_list': [],
            'cursor': cursorURLSafe,
            'more': more
        }

        if userItemsQuery:

            # construct python dictionary
            for userItem in userItemsQuery:

                # get user item as object
                userItemObj = ItemService.getUserItem(userItem.key.urlsafe())

                # insert into user items list
                userItems['user_items_list'].append(userItemObj)

            return userItems
